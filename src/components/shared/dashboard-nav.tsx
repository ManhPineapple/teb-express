import { useSidebar } from "@/hooks/useSidebar";
import { NavItem } from "@/types";
import { cn } from "@/utils/cn";
import { Dispatch, SetStateAction, useState } from "react";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";
import { NavLink } from "react-router-dom";
import { Icons } from "../ui/icons";

type DashboardNavProps = {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

type DashboardNavItemProps = {
  item: NavItem;
  setOpen?: Dispatch<SetStateAction<boolean>>;
};

const DashboardNavItem: React.FC<DashboardNavItemProps> = ({
  item,
  setOpen,
}) => {
  const Icon = Icons[item.icon || "arrowRight"];
  const [isShowSettingOptions, setIsShowSettingOptions] = useState(false);
  const { isMinimized } = useSidebar();

  const handleMouseEnter = () => setIsShowSettingOptions(true);
  const handleMouseLeave = () => setIsShowSettingOptions(false);

  return (
    <div>
      <div key={item.href} onClickCapture={() => setOpen && setOpen(false)}>
        {item.href && !item.children && (
          <NavLink
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-full px-3 py-2 text-[#8d181b] transition-colors duration-300 hover:bg-gray-50 hover:text-[#8d181b] dark:hover:text-[#8d181b]",
                isActive && "bg-gray-50 text-[#8d181b] dark:text-[#8d181b]"
              )
            }
            to={item.href}
            end
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {!isMinimized && (
              <span className="ml-2 truncate">{item.title}</span>
            )}
          </NavLink>
        )}
      </div>

      {item.children && (
        <>
          <div
            className="relative flex items-center rounded-full px-3 py-2 text-[#8d181b] transition-colors duration-300 hover:bg-gray-50 hover:text-[#8d181b] dark:hover:text-[#8d181b]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
            {!isMinimized && (
              <span className="ml-2 truncate">{item.title}</span>
            )}
            <div className="ml-auto">
              {isShowSettingOptions ? <GoTriangleDown /> : <GoTriangleRight />}
            </div>
            {isShowSettingOptions && isMinimized && (
              <div
                className="absolute left-full top-0 flex flex-col bg-[#EEEDEB] shadow-lg border rounded-lg w-52"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {item.children.map((child) => (
                  <div
                    className="my-1"
                    key={child.href}
                    onClickCapture={() => setOpen && setOpen(true)}
                  >
                    <NavLink
                      className={({ isActive }) =>
                        cn(
                          "flex items-center rounded-full px-3 py-2 text-[#8d181b] transition-colors duration-300 hover:bg-gray-50 hover:text-[#8d181b] dark:hover:text-[#8d181b]",
                          isActive &&
                            "bg-gray-50 text-[#8d181b] dark:text-[#8d181b]"
                        )
                      }
                      to={child.href}
                      end
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="mx-2 text-sm font-medium">
                        {child.label}
                      </span>
                    </NavLink>
                  </div>
                ))}
              </div>
            )}
          </div>
          {isShowSettingOptions && !isMinimized && (
            <div
              className="ml-5 left-full top-0 flex flex-col bg-[#EEEDEB] shadow-lg"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {item.children.map((child) => (
                <div
                  className="my-1"
                  key={child.href}
                  onClickCapture={() => setOpen && setOpen(false)}
                >
                  <NavLink
                    className={({ isActive }) =>
                      cn(
                        "flex items-center rounded-full px-3 py-2 text-[#8d181b] transition-colors duration-300 hover:bg-gray-50 hover:text-[#8d181b] dark:hover:text-[#8d181b]",
                        isActive &&
                          "bg-gray-50 text-[#8d181b] dark:text-[#8d181b]"
                      )
                    }
                    to={child.href}
                    end
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="mx-2 text-sm font-medium">
                      {child.label}
                    </span>
                  </NavLink>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default function DashboardNav({ items, setOpen }: DashboardNavProps) {
  if (!items?.length) return null;

  return (
    <nav className="-mx-3 space-y-2">
      {items.map((item) => (
        <DashboardNavItem key={item.href} item={item} setOpen={setOpen} />
      ))}
    </nav>
  );
}
