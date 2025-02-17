import { CLAIM_STATUS_TEXT, MAP_REASON_CATEGORY_TEXT } from "@/constants/claim";
import {
  fetchMessage,
  fetchTicket,
  reply,
  updateFileTicket,
} from "@/services/claim";
import { User } from "@/types/user";
import { format } from "date-fns";
import { cloneDeep } from "lodash";
import { LoaderCircle, Paperclip, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Messages } from "./components/Message";

type ClaimDetail = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  category: number;
  object_id: number;
  attachment: string[] | null;
  status: number;
  status_rep: number;
  type: number;
  amount: number;
  is_rated: boolean;
  package_code: string;
  user: User;
};

export type Message = {
  id: number;
  ticket_id: number;
  user_id: number;
  full_name: string;
  role: string;
  content: string;
  attachment: string[] | null;
  status: number;
  created_at: string;
};

export type LastMessage = {
  id: number;
  ticket_id: number;
  user_id: number;
  full_name: string;
  role: string;
  content: string;
  attachment: string[] | null;
  status: number;
  created_at: string;
  datetime?: string;
  dd?: string;
  items: string[];
};

type FileWithUid = {
  uid: string;
  raw: File;
  name: string;
  url?: string;
};

const datetime = (dateStr: string, formatStr: string): string => {
  const date = new Date(dateStr);
  return format(date, formatStr);
};

export function ClaimDetail() {
  const { id } = useParams<{ id: any }>();
  const [claimDetail, setClaimDetail] = useState<ClaimDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState<FileWithUid[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [countIsUploading, setCountIsUploading] = useState<number>(0);

  const regexName = /_\w{8}-\w{4}-\w{4}-\w{4}-\w{12}.(xlsx|jpg|png|jpeg)$/gi;

  const validateTypeFile = (file: File): boolean => {
    const validTypes = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    return validTypes.includes(file.type);
  };

  const handleFileChange = (file: FileWithUid) => {
    const index = files.findIndex(({ uid }) => uid === file.uid);
    if (index !== -1) {
      const newFiles = [...files];
      newFiles[index] = file;
      setFiles(newFiles);
    }

    if (validateTypeFile(file.raw)) {
      handleUploadFile(file);
    } else {
      setCountIsUploading((prev) => prev - 1);
      setFileErrors((prev) => [
        ...new Set([
          ...prev,
          `"${file.name}" định dạng không đúng. Tệp phải có định dạng: *XLSX, *PNG, *JPG, *JPEG.`,
        ]),
      ]);
    }
  };

  const handleUploadFile = async (file: FileWithUid) => {
    const body = new FormData();
    body.append("file", file.raw);

    setIsUploading(true);
    try {
      const res = await updateFileTicket({ file: file.raw });
      if (res.error) {
        setFileErrors((prev) => [...prev, res.data.message]);
      } else {
        setFiles((prevFiles) => [...prevFiles, { ...file, url: res.url }]);
      }
    } catch (error: any) {
      setFileErrors((prev) => [...prev, error.message]);
    } finally {
      setCountIsUploading((prev) => prev - 1);
      if (countIsUploading <= 1) {
        setIsUploading(false);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const uid = new Date().getTime().toString();
      handleFileChange({ uid, raw: file, name: file.name });
      setCountIsUploading((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const fetchClaimDetail = async () => {
      try {
        const ticket = await fetchTicket(id);
        setClaimDetail(ticket.ticket);
      } catch (error) {
        console.error("Error fetching claims:", error);
      }
    };

    const getMessage = async () => {
      try {
        const message = await fetchMessage(id);
        setMessages(message.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchClaimDetail();
    getMessage();
  }, [id]);

  const urls = files.map(({ url }) => url);
  console.log("urlsError:", fileErrors);
  console.log("urls:", files);

  const onConfirm = (file: FileWithUid) => {
    setFiles((prevFiles) => prevFiles.filter(({ uid }) => uid !== file.uid));
  };

  const handleSendMessage = async () => {
    try {
      if (newMessage.trim()) {
        await reply(id, newMessage.trim(), urls);
        const updatedMessages = await fetchMessage(id);
        setMessages(updatedMessages.messages);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const attachments = () => {
    const attachments = [];

    if (messages && messages.length) {
      for (const message of messages) {
        const files = (message.attachment || []).map((src) => ({
          src,
          name: src.replace(regexName, `.$1`).split("/").pop(),
          created_at: message.created_at,
        }));

        attachments.push(...files);
      }
    }

    const files = (claimDetail?.attachment || []).map((src) => ({
      src,
      name: src.replace(regexName, `.$1`).split("/").pop(),
      created_at: claimDetail ? claimDetail.created_at : "",
    }));

    attachments.push(...files);
    return attachments;
  };

  const displayMessages = () => {
    let last: LastMessage | null = null;
    const results = [];
    const clonedMessages = [...(messages || [])];
    clonedMessages.reverse();

    const now = datetime(new Date().toISOString(), "yyyyMMdd");
    const nowYear = datetime(new Date().toISOString(), "yyyy");

    for (const message of clonedMessages) {
      const dd = datetime(message.created_at, "yyyyMMdd");

      if (last) {
        if (last.user_id !== message.user_id || last.dd !== dd) {
          results.push(last);
          last = null;
        }
      }

      if (!last) {
        // @ts-expect-error similar object
        last = cloneDeep(message);
        last!.dd = dd;
      }

      last!.datetime = datetime(last!.created_at, "dd/MM hh:mm aa");
      if (now === dd) {
        last!.datetime = datetime(last!.created_at, "hh:mm aa");
      } else if (nowYear !== datetime(message.created_at, "yyyy")) {
        last!.datetime = datetime(last!.created_at, "dd/MM/yyyy hh:mm aa");
      }

      if (last?.items) {
        last.items.push(message.content);
      } else {
        last!.items = [message.content];
      }
    }

    if (last) {
      results.push(last);
    }
    return results;
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    // @ts-expect-error Property 'scrollIntoView' does exist on type 'never'.
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages()]);

  return (
    <div className="flex space-x-7 bg-[#f5f5f4] h-full max-sm:grid max-sm:grid-cols-1 max-sm:h-max">
      <div className="w-1/5"></div>
      <div className="sm:w-3/5 mt-5 max-sm:pr-5">
        <div className="bg-white shadow p-4 rounded mb-4 text-2xl font-bold border-l-2 border-[#722ed1]">
          {claimDetail?.title}
        </div>
        <div className="bg-white shadow p-4 mb-4 rounded h-[600px] min-h-[300px] overflow-y-scroll">
          {displayMessages().map((message) => (
            <Messages message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="bg-white shadow p-4">
          <div className="mt-4 flex items-center space-x-2">
            <div className="file-upload">
              <input
                id="fileInput"
                type="file"
                onChange={handleInputChange}
                className="border border-gray-300 p-2 rounded mb-2 hidden"
              />
              <label
                htmlFor="fileInput"
                className=" p-2 rounded cursor-pointer flex items-center"
              >
                <Paperclip className="mr-2" />
              </label>
            </div>
            <input
              type="text"
              placeholder="Nhập lời nhắn..."
              className="flex-grow p-2 border rounded"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              className="px-4 py-2 bg-[#00978c] text-white rounded"
              onClick={handleSendMessage}
            >
              {isUploading && <LoaderCircle />}
              {!isUploading && <Send />}
            </button>
          </div>
          <p className="text-sm text-[#aaabab] mt-3">
            * Định dạng file hợp lệ : XLSX, PNG, JPG, JPEG.Và có dung lượng dưới
            5Mb
          </p>
          <div>
            {fileErrors.length > 0 && (
              <ul>
                {fileErrors.map((error, index) => (
                  <li key={index} style={{ color: "red" }}>
                    {error}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {files.map((item) => (
            <div className="flex gap-1">
              <div>{item.name}</div>
              <X
                className="h-4 w-4 mt-1 cursor-pointer"
                onClick={() => onConfirm(item)}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="sm:w-2/5 space-y-4 mt-5 max-sm:pr-5">
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-bold mb-3">Thông tin</h2>
          <hr className="mb-3" />
          <p className="mb-2">
            LB tracking:
            <Link to={`/package/details/${claimDetail?.object_id}`}>
              <span className="text-[#006a5e] font-medium ml-3">
                {claimDetail?.package_code}
              </span>
            </Link>
          </p>
          <p className="mb-2">
            Create date:
            <span className="ml-3">
              {claimDetail?.created_at
                ? format(new Date(claimDetail.created_at), "dd/MM/yyyy")
                : ""}
            </span>
          </p>
          <p className="mb-2">
            Reason:
            <span className="ml-3">
              {claimDetail?.category
                ? MAP_REASON_CATEGORY_TEXT[claimDetail?.category]
                : ""}
            </span>
          </p>
          <p className="mb-2">
            Status:
            <span
              className={`text-base font-medium px-2 p-1 rounded-2xl capitalize ml-3 ${
                claimDetail?.status
                  ? CLAIM_STATUS_TEXT[claimDetail.status].className
                  : "N/A"
              }`}
            >
              {claimDetail?.status
                ? CLAIM_STATUS_TEXT[claimDetail?.status].text
                : ""}
            </span>
          </p>
        </div>
        <div className="bg-white shadow p-4 rounded">
          <h2 className="font-bold mb-2">File</h2>
          <hr />
          <div className="card-content mt-2 overflow-y-scroll h-[274px]">
            <div>
              {attachments().map((item) => (
                <div className="flex">
                  <div className="block bg-[#f6f7f7] h-12 w-16 mr-2 cursor-pointer">
                    <img className="block" alt="png" src="gdg.png" />
                  </div>
                  <div>
                    <div>{item.name}</div>
                    <time className="text-sm text-[#aaabab]">
                      {format(
                        new Date(item.created_at),
                        "dd/MM/yyyy - HH:mm:ss"
                      )}
                    </time>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/5 max-sm:mb-5"></div>
    </div>
  );
}
