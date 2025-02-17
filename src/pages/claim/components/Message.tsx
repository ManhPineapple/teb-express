import { ROLE_ACCOUNTANT, ROLE_ADMIN, ROLE_SUPPORT } from "@/constants/claim";
import { LastMessage } from "../ClaimDetail";

type MessagesProps = {
  message: LastMessage;
};

export const Messages = ({ message }: MessagesProps) => {
  const ROLE_AnanBay = [ROLE_ADMIN, ROLE_SUPPORT, ROLE_ACCOUNTANT];

  const getUserId = (): number | null => {
    const storedState = localStorage.getItem("auth-storage");
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState);
        return parsedState.state.user.id;
      } catch (error) {
        console.error("Failed to parse auth state from local storage:", error);
        return null;
      }
    }
    return null;
  };

  const isMeReply = () => {
    return message.user_id == getUserId();
  };

  const roleName = () => {
    if (ROLE_AnanBay.includes(message.role)) {
      return "CSKH";
    }

    return "";
  };

  return (
    <div className="card-content p-4">
      <div className="box-message relative">
        <div className="list-messages">
          {isMeReply() && (
            <div className="message-me">
              <div className="user flex-row-reverse flex">
                <div className="avatar mr-0 ml-2">
                  <img src="../../../../avatar-dark.svg" />
                </div>
                <div className="info text-right">
                  <p className="user-name leading-5 mb-[-5px] font-bold">
                    <span>{message.full_name}</span>
                    <span>{roleName()}</span>
                  </p>
                  <time className="font-semibold text-[10px] text-[#626363]">
                    {message.datetime}
                  </time>
                </div>
              </div>
              <div className="message-content mr-[40px]">
                {message.items &&
                  message.items.map((ms, index) => (
                    <div className="message-text text-right" key={index}>
                      <div
                        className={`w-text bg-[#3f51b5] text-[#fff] p-4 mb-px inline-block ${
                          index === message.items.length - 1
                            ? "rounded-custom-br-last"
                            : "rounded-custom-br"
                        }`}
                      >
                        <p className="m-0">{ms}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {!isMeReply() && (
            <div className="message">
              <div className="user flex">
                <div className="avatar mr-2">
                  <img src="../../../../avatar-dark.svg" />
                </div>
                <div className="info">
                  <p className="user-name leading-5 mb-[-5px] font-bold">
                    <span>{message.full_name}</span>
                    <span className="text-[#00b7b0] bg-[#ddf2f2] text-xs rounded-xl px-1 ml-2">
                      {roleName()}
                    </span>
                  </p>
                  <time className="font-semibold text-[10px] text-[#626363]">
                    {message.datetime}
                  </time>
                </div>
              </div>
              <div className="message-content ml-[40px]">
                {message.items &&
                  message.items.map((ms, index) => (
                    <div className="message-text" key={index}>
                      <div
                        className={`w-text p-4 mb-px inline-block ${
                          index === message.items.length - 1
                            ? "bg-[#f6f7f7] rounded-custom-bl-last"
                            : "bg-[#f6f7f7] rounded-custom-bl"
                        }`}
                      >
                        <p className="m-0">{ms}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
