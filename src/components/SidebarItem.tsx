interface Menu {
  name: string;
}

interface SidebarItemProps {
  menu: Menu;
}

export default function SidebarItem({ menu }: SidebarItemProps) {
  return (
    <div className="sidebar-item">
      <p>{menu.name}</p>
    </div>
  );
}
