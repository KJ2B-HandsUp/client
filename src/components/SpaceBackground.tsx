export default function SpaceBackground(props) {
  return (
    <div style={{ backgroundImage: "url(/space_background.jpg)" }}>
      {props.children}
    </div>
  );
}
