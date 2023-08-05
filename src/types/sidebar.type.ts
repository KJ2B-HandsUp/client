export type SidebarItemType = {
  name: string;
  path: string;
  components?: JSX.Element;
};

export type SidebarProps = {
  items: SidebarItemType[];
};
