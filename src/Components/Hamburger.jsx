import React from "react";
import styled from "styled-components";

const Hamburger = ({ onToggle, isSidebarOpen, scrolled = false }) => {
  const handleClick = () => {
    onToggle();
  };

  return (
    <>
      <StyledWrapper $scrolled={scrolled} $isOpen={isSidebarOpen}>
        <div id="menuToggle">
          <input
            id="checkbox"
            type="checkbox"
            checked={isSidebarOpen}
            onChange={handleClick}
          />
          <label className="toggle" htmlFor="checkbox">
            <div className="bar bar--top" />
            <div className="bar bar--middle" />
            <div className="bar bar--bottom" />
          </label>
        </div>
      </StyledWrapper>
    </>
  );
};

const StyledWrapper = styled.div`
  #checkbox {
    display: none;
  }

  .toggle {
    position: relative;
    width: 40px;
    cursor: pointer;
    margin: auto;
    display: block;
    transform: scale(0.7);
    height: calc(4px * 3 + 11px * 2);
  }

  .bar {
    position: absolute;
    left: 0;
    right: 0;
    height: 3px;
    border-radius: calc(3px / 2);
    background: ${props => props.$scrolled ? 'rgba(255, 255, 255, 0.9)' : 'var(--primary)'};
    opacity: 1;
    transition: none 0.35s cubic-bezier(0.5, -0.35, 0.35, 1.5) 0s;
  }

  /***** Collapse Animation *****/

  .bar--top {
    bottom: calc(50% + 11px + 3px / 2);
    transition-property: bottom, margin, transform;
    transition-delay: calc(0s + 0.35s), 0s, 0s;
    width: ${props => props.$isOpen ? '100%' : '70%'};
    left: ${props => props.$isOpen ? '0' : 'auto'};
    right: 0;
  }

  .bar--middle {
    top: calc(50% - 3px / 2);
    transition-property: top, opacity;
    transition-duration: 0.35s, 0s;
    transition-delay: calc(0s + 0.35s * 1.3), calc(0s + 0.35s * 1.3);
    width: 100%;
  }

  .bar--bottom {
    top: calc(50% + 11px + 3px / 2);
    transition-property: top, transform;
    transition-delay: 0s;
    width: ${props => props.$isOpen ? '100%' : '85%'};
    left: 0;
    right: ${props => props.$isOpen ? '0' : 'auto'};
  }

  #checkbox:checked + .toggle .bar--top {
    bottom: calc(50% - 11px - 3px);
    margin-bottom: calc(11px + 3px / 2);
    transform: rotate(45deg);
    transition-delay: calc(0s + 0.35s * 0.3), calc(0s + 0.35s * 1.3),
      calc(0s + 0.35s * 1.3);
    width: 100%;
    left: 0;
  }

  #checkbox:checked + .toggle .bar--middle {
    top: calc(50% + 11px);
    opacity: 0;
    transition-duration: 0.35s, 0s;
    transition-delay: 0s, calc(0s + 0.35s);
  }

  #checkbox:checked + .toggle .bar--bottom {
    top: calc(50% - 3px / 2);
    transform: rotate(-45deg);
    transition-delay: calc(0s + 0.35s * 1.3), calc(0s + 0.35s * 1.3);
    width: 100%;
    right: 0;
  }
`;

export default Hamburger;
