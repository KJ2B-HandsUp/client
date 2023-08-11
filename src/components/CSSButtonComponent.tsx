// CSSButtonComponent.tsx
import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-image: linear-gradient(19deg, #21d4fd 0%, #b721ff 100%);
  color: white;
  font-family: inherit;
  padding: 0.35em;
  padding-left: 1.2em;
  width: 150px;
  font-size: 17px;
  border-radius: 10em;
  border: none;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  height: 2.8em;
  padding-right: 3.3em;
  cursor: pointer;
  text-transform: uppercase;
  font-weight: 500;
  box-shadow:
    0 0 1.6em rgba(183, 33, 255, 0.3),
    0 0 1.6em hsla(191, 98%, 56%, 0.3);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);

  &:hover .icon {
    width: calc(100% - 0.6em);
  }

  &:active .icon {
    transform: scale(0.9);
  }
`;

const Icon = styled.div`
  background: white;
  margin-left: 1em;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.2em;
  width: 2.2em;
  border-radius: 10em;
  right: 0.3em;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);

  & svg {
    width: 1.1em;
    transition: transform 0.3s;
    color: #b721ff;
  }

  ${StyledButton}:hover & svg {
    transform: translateX(0.1em);
  }
`;

export default function CSSButtonComponent(props) {
  return (
    <StyledButton {...props}>
      {props.children}
      <Icon className="icon">
        <svg
          height="24"
          width="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            fill="currentColor"
          ></path>
        </svg>
      </Icon>
    </StyledButton>
  );
}
