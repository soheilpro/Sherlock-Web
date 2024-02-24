export function isInteractiveElement(element: Element): boolean {
  if (isElementOrParentsOfType(element, HTMLAnchorElement))
    return true;

  if (isElementOrParentsOfType(element, HTMLButtonElement))
    return true;

  if (isElementOrParentsOfType(element, HTMLInputElement))
    return true;

  if (isElementOrParentsOfType(element, HTMLTextAreaElement))
    return true;

  if (isElementOrParentsOfType(element, HTMLLabelElement))
    return true;

  return false;
}

function isElementOrParentsOfType(element: Element, type: { new (): any; }): boolean {
  while (true) {
    if (element instanceof type)
      return true;

    if (!element.parentElement)
      break;

    element = element.parentElement;
  }

  return false;
}
