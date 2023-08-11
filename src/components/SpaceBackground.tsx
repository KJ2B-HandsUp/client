export default function SpaceBackground(props) {
  return (
    <div
      style={{
        backgroundImage: "url(/space_background.jpg)",
        zIndex: -1000000,
      }}
    >
      {props.children}
    </div>
  );
}
