import styled from "styled-components";
import { motion } from "framer-motion";

const Card = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #212121;
  border: 2px solid #313131;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  color: gold;

  &:hover {
    box-shadow: 0 0 20px rgba(9, 117, 241, 0.8);
    border-color: #0974f1;
  }
`;

const Content = styled.div`
  display: flex;
  color: #e8e8e8;
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
`;

const Heading = styled.div`
  font-weight: 700;
  font-size: 3vw;
  color: gold;
  text-align: center;
`;

const Paragraph = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.5;
  gap: 20px;
`;

const Footer = styled.div`
  bottom: 10px;
`;

export default function HoverCard(props) {
  return (
    <Card {...props}>
      <Heading>{props.header}</Heading>
      <div
        style={{
          position: "relative",
          width: "30vw",
          height: "1px",
          backgroundColor: "gold",
          margin: "20px",
        }}
      />
      <Paragraph>{props.children}</Paragraph>
    </Card>
  );
}
