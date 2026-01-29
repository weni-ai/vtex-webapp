import { forwardRef } from "react";

export function calculateCursorPosition(originalElement: HTMLTextAreaElement, cloneElement: HTMLElement, contentText: string) {
  const style = originalElement.computedStyleMap ? originalElement.computedStyleMap() : new Map();

  ['padding', 'border', 'font', 'white-space-collapse'].forEach((attribute) => {
    cloneElement.style[attribute as 'padding' | 'border' | 'font' | 'whiteSpaceCollapse'] = style.get(attribute)?.toString() ?? ''
  })

  cloneElement.style['width'] = originalElement.offsetWidth + 'px';

  cloneElement.innerHTML = '';
  cloneElement.innerText = contentText.slice(0, originalElement.selectionStart);

  const end = document.createElement('span');
  end.appendChild(document.createTextNode(''));
  cloneElement.appendChild(end);
  cloneElement.appendChild(document.createTextNode(contentText.slice(originalElement.selectionStart)));

  return {
    x: end.offsetLeft,
    y: end.offsetTop,
  }
}

export const TextareaClone = forwardRef<HTMLDivElement>((props, ref) => {
  return <div ref={ref} {...props} style={{
    height: 0,
    position: 'absolute',
    userSelect: 'none',
    pointerEvents: 'none',
    opacity: 0,
  }}>
    <textarea />
  </div>;
});

TextareaClone.displayName = 'TextareaClone';
