export function scrollToElement(container: HTMLElement, element: HTMLElement) {
    let borderTopValue: string = getComputedStyle(container).getPropertyValue('borderTopWidth');
    let borderTop: number = borderTopValue ? parseFloat(borderTopValue) : 0;
    let paddingTopValue: string = getComputedStyle(container).getPropertyValue('paddingTop');
    let paddingTop: number = paddingTopValue ? parseFloat(paddingTopValue) : 0;
    let containerRect = container.getBoundingClientRect();
    let itemRect = element.getBoundingClientRect();
    let offset = (itemRect.top + document.body.scrollTop) - (containerRect.top + document.body.scrollTop) - borderTop - paddingTop;
    let scroll = container.scrollTop;
    let elementHeight = container.clientHeight;
    let itemHeight = element.offsetHeight;

    if (offset < 0) {
        container.scrollTop = scroll + offset;
    } else if ((offset + itemHeight) > elementHeight) {
        container.scrollTop = scroll + offset - elementHeight + itemHeight;
    }
}

