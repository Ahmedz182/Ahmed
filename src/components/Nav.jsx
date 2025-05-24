import { Dropdown, Space } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const Nav = ({ title, menuItem }) => {
  const dropdownItems = menuItem.map((item, index) => ({
    key: index,
    label: (
      <span
        onClick={() => {
          const section = document.getElementById(item.replace(/\s+/g, "-"));
          if (section) section.scrollIntoView({ behavior: "smooth" });
        }}>
        {item}
      </span>
    ),
  }));

  return (
    <div className="flex justify-between items-center mx-5 lg:mx-10 md:mx-5 sm:mx-2 py-4">
      <span className="font-medium text-2xl text-white bg-[#42a5e3] px-3 py-1 uppercase rounded-r-xl">
        {title}
      </span>

      {/* Desktop Menu */}
      <div className="gap-x-10 justify-end hidden lg:flex">
        {menuItem.map((item, index) => (
          <span
            key={index}
            onClick={() => {
              const section = document.getElementById(
                item.replace(/\s+/g, "-")
              );
              if (section) section.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-lg font-semibold text-gray-600 transition duration-200 ease-linear hover:text-[#389cd6] cursor-pointer">
            {item}
          </span>
        ))}
      </div>

      {/* Mobile Dropdown Menu */}
      <div className="lg:hidden">
        <Dropdown menu={{ items: dropdownItems }}>
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <i class="ri-menu-4-line cursor-pointer text-2xl"></i>
            </Space>
          </a>
        </Dropdown>
      </div>
    </div>
  );
};

export default Nav;
