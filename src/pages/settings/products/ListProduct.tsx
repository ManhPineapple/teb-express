import { AlertModal } from "@/components/shared/alert-modal";
import DataTable from "@/components/shared/data-table";
import ImportModal from "@/components/shared/import-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Modal } from "@/components/ui/modal";
import { TProduct } from "@/constants/data";
import { handleCopy } from "@/pages/packages/components/packages-table/columns";
import {
  getProductsCount,
  getProductsData,
} from "@/services/settings/products";
import { CustomAxios } from "@/utils/customAxios";
import { ColumnDef } from "@tanstack/react-table";
import { Copy, Plus, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { BiSolidEdit, BiTime } from "react-icons/bi";
import { CiTrash } from "react-icons/ci";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ImportProductForm from "./ImportProductForm";
import ModalAddOrUpdateProduct, { ModalProductLog } from "./ModalProduct";

const ListProductPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>();
  const [searchValue, setSearchValue] = useState<string>();

  const [pageCount, setPageCount] = useState<number>(0);
  const [productsData, setProductsData] = useState<any>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const page = Number(searchParams.get("page")) || 1;
      const limit = Number(searchParams.get("limit")) || 10;

      try {
        const products = await getProductsData(page, limit, searchValue);
        setProductsData(products);

        const count = await getProductsCount(page, limit, searchValue);
        setPageCount(count);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [searchValue, searchParams]);

  const handleSearch = () => {
    setSearchValue(searchInput);
  };

  return (
    <div className="">
      <div className="page-header sm:flex justify-between px-6 pt-0 pb-[18px] mt-5">
        <div className="w-full relative">
          <Search className="absolute top-[0.5rem] mx-2 pl-2" />
          <input
            type="search"
            placeholder="Tìm kiếm theo tên sản phẩm hoặc SKU"
            className="mb-2 border border-gray-300 p-2 rounded w-full ml-2 px-6"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <div className="w-1/2 flex sm:justify-end">
          <ImportModal
            renderModal={(onClose) => (
              <ImportProductForm modalClose={onClose} />
            )}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                className="btn btn-primary flex items-center bg-blue-500 text-white p-2 rounded-xl px-4 mx-2"
              >
                <Plus size={20} className="mr-1" /> Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="border-b pb-4 border-slate-500">
                  Thêm sản phẩm
                </DialogTitle>
              </DialogHeader>

              <ModalAddOrUpdateProduct product={undefined} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="p-7">
        <DataTable
          columns={tableColumns}
          data={productsData}
          pageCount={pageCount}
        ></DataTable>
      </div>
    </div>
  );
};

const tableColumns: ColumnDef<TProduct>[] = [
  {
    accessorKey: "name",
    header: "Tên sản phẩm",
    cell: ({ row }) => {
      return (
        <div className="flex gap-10 justify-between">
          <div className="capitalize font-medium">{row.original.name}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <div>{row.original.sku}</div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy
              className="h-4 w-4 hover:text-[#20bddb] cursor-pointer"
              onClick={() => handleCopy(`${row.original.sku}`)}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Số lượng",
    cell: ({ row }) => {
      return <div>{row.original.stock}</div>;
    },
  },
  {
    accessorKey: "price",
    header: "Giá sản phẩm",
    cell: ({ row }) => {
      return <div>${parseFloat(row.original.price.toFixed(2))}</div>;
    },
  },
  {
    accessorKey: "detail",
    header: "Loại sản phẩm",
    cell: ({ row }) => {
      return <div>{row.original.detail}</div>;
    },
  },
  {
    accessorKey: "weight",
    header: "Cân nặng (gram)",
    cell: ({ row }) => {
      return <div>{row.original.weight}</div>;
    },
  },
  {
    header: "Size (cm)",
    cell: ({ row }) => {
      const data = row.original;
      return <div>{`${data.length}x${data.width}x${data.height}`}</div>;
    },
  },
  {
    accessorKey: "country",
    header: "Quốc gia",
    cell: ({ row }) => {
      return <div>{row.original.country}</div>;
    },
  },
  {
    header: "Action",
    cell: ({ row }) => {
      return <ActionCell row={row.original} />;
    },
  },
];

const ActionCell: React.FC<{ row: TProduct }> = ({ row }) => {
  const [isShowDeleteModal, setIsShowDeleteModal] = useState<boolean>(false);
  const [isShowUpdateModal, setIsShowUpdateModal] = useState<boolean>(false);
  const [isShowProductLogModal, setIsShowProductLogModal] =
    useState<boolean>(false);
  const product = {
    name: row.name,
    sku: row.sku,
    stock: row.stock,
    price: row.price,
    detail: row.detail,
    material: row.material,
    weight: row.weight,
    country: row.country,
    length: row.length,
    width: row.width,
    height: row.height,
  };

  return (
    <div className="flex">
      <div className="border rounded-md mx-1 cursor-pointer">
        <Modal
          className="sm:max-w-[425px]"
          isOpen={isShowUpdateModal}
          onClose={() => setIsShowUpdateModal(false)}
        >
          <ModalAddOrUpdateProduct product={product} updateId={row.id} />
        </Modal>
        <BiSolidEdit size={20} onClick={() => setIsShowUpdateModal(true)} />
      </div>
      <div className="border rounded-md mx-1 cursor-pointer">
        <AlertModal
          isOpen={isShowDeleteModal}
          onClose={() => {
            setIsShowDeleteModal(false);
          }}
          onConfirm={async () => {
            const response = await CustomAxios.delete(
              `/products/${row.id}`
            );
            if (response.status === 200)
              toast.success("Xóa sản phẩm thành công!");
            setTimeout(() => window.location.reload(), 1000);
            setIsShowDeleteModal(false);
          }}
          loading={false}
        ></AlertModal>
        <CiTrash size={20} onClick={() => setIsShowDeleteModal(true)} />
      </div>
      <div className="border rounded-md mx-1 cursor-pointer">
        <ModalProductLog
          onClose={() => setIsShowProductLogModal(false)}
          isOpen={isShowProductLogModal}
          product={{ sku: row.sku, id: row.id }}
        />
        <BiTime size={20} onClick={() => setIsShowProductLogModal(true)} />
      </div>
    </div>
  );
};

export default ListProductPage;
