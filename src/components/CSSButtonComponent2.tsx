import styled from "styled-components";

const ButtonContent = styled.span`
  position: relative;
  z-index: 1;
`;

const ButtonBackground = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: #0974f1;
  border-radius: 50%;
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
`;

const AnimatedButton = styled.button`
  position: relative;
  display: inline-block;
  padding: 12px 36px;
  border: none;
  font-size: 26px;
  background-color: inherit;
  border-radius: 100px;
  font-weight: 600;
  color: #ffffff40;
  box-shadow: 0 0 0 2px #ffffff20;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover {
    box-shadow: 0 0 0 5px #2195f360;
    color: #ffffff;
  }

  &:active {
    scale: 0.95;
  }

  &:hover ${ButtonBackground} {
    width: 150px;
    height: 150px;
    opacity: 1;
  }
`;

export default function CSSButtonComponent2(props) {
  return (
    <AnimatedButton {...props}>
      <ButtonContent>{props.children}</ButtonContent>
      <ButtonBackground />
    </AnimatedButton>
  );
}
