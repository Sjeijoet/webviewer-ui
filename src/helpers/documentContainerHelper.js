import { isIEEdge, isIE11 } from 'helpers/device';

// When a panel opens/closes, we want to shift the container accordingly
// The normal way to do this is through css
// For example, when left panel opens, we add 'left-panel' to the className, make the container width become calc(100%-#{$left-panel-width})
// and use css transition to achieve a smooth panel opening animation
// However, IE11 and Edge haven't supported using transition and calc(...) together,
// So we have to calculate the width manually.
export const updateContainerWidth = (prevProps, props, container) => {
  const { leftPanelWidth = 300 } = props;
  const rightPanelWidth = 300;

  const leftPanelClosed = prevProps.isLeftPanelOpen && !props.isLeftPanelOpen;
  if (leftPanelClosed) {
    // Archive-IT:
    ////expandContainerWidthBy(leftPanelWidth, container);
    ////container.style.marginLeft = '0px';
    expandContainerWidthBy(leftPanelWidth, container, true);
    container.style.marginLeft = '0px';
    if (isIE11) {
      // pageNavOverlay - transform.
      $('div[data-element="pageNavOverlay"]').css('transform', 'translateX(0px)');
      // document-loader - width.
      $('.document-loader').css('width', container.style.width);
    }
    // Archive-IT End:
  }

  const rightPanelClosed = prevProps.isRightPanelOpen && !props.isRightPanelOpen;
  if (rightPanelClosed) {
    expandContainerWidthBy(rightPanelWidth, container);
    // Archive-IT:
    if (isIE11) {
      $('.docnav.next').css('right', '0px');
      // document-loader - width.
      $('.document-loader').css('width', container.style.width);
    }
    // Archive-IT End:
  }

  const leftPanelOpened = !prevProps.isLeftPanelOpen && props.isLeftPanelOpen;
  if (leftPanelOpened) {
    // Archive-IT:
    if (isIE11) {
      let leftPanelWidth = parseInt($('div[data-element="leftPanel"]').css('width'), 10);
      shrinkContainerWidthBy(leftPanelWidth, container, true);
      container.style.marginLeft = `${leftPanelWidth}px`;
      // pageNavOverlay - transform.
      $('div[data-element="pageNavOverlay"]').css('transform', 'translateX(' + leftPanelWidth + 'px)');
      // document-loader - width.
      $('.document-loader').css('width', container.style.width);
      return;
    }
    // Archive-IT End:
    shrinkContainerWidthBy(leftPanelWidth, container);
    container.style.marginLeft = `${leftPanelWidth}px`;
  }

  const leftPanelResized = props.isLeftPanelOpen && prevProps.leftPanelWidth !== props.leftPanelWidth;
  if (leftPanelResized) {
    // Archive-IT:
    ////container.style.width = `${window.innerWidth - leftPanelWidth}px`;
    if (isIE11) {
      const docNavNext = 22;
      container.style.width = `${window.innerWidth - leftPanelWidth - docNavNext}px`;
    } else {
      container.style.width = `${window.innerWidth - leftPanelWidth}px`;
    }
    // Archive-IT End:
    container.style.marginLeft = `${leftPanelWidth}px`;
  }

  const rightPanelOpened = !prevProps.isRightPanelOpen && props.isRightPanelOpen;
  if (rightPanelOpened) {
    shrinkContainerWidthBy(rightPanelWidth, container);
    // Archive-IT:
    if (isIE11) {
      $('.docnav.next').css('right', `${rightPanelWidth}px`);
      // document-loader - width.
      $('.document-loader').css('width', container.style.width);
    }
    // Archive-IT End:
  }
};

const getWidthAfterTransition = container => {
  const oldTransition = container.style.transition;
  container.style.transition = 'none';
  const containerWidth = parseInt(window.getComputedStyle(container).width, 10);
  container.style.transition = oldTransition;

  return containerWidth;
};

// Archive-IT:
////const expandContainerWidthBy = (panelWidth, container) => {
const expandContainerWidthBy = (panelWidth, container, leftPanel = false) => {
  const containerWidth = getWidthAfterTransition(container);

  if (isIEEdge) {
    container.style.width = `${containerWidth + panelWidth}px`;
  }

  if (isIE11) {
    // need to add 'scrollBarWidth' or it breaks after "npm run build", this isn't needed for npm run start
    // Archive-IT:
    ////const scrollBarWidth = 17;
    ////container.style.width = `${containerWidth + panelWidth + scrollBarWidth}px`;
    const docNavNext = 22;
    if (leftPanel) {
      container.style.width = `${window.innerWidth - docNavNext}px`;
    } else {
      let leftPanelWidth = parseInt($('div[data-element="leftPanel"]').css('width'), 10);
      container.style.width = `${window.innerWidth - leftPanelWidth - docNavNext}px`;
    }
    // Archive-IT End:
  }
};

// Archive-IT:
////const shrinkContainerWidthBy = (panelWidth, container) => {
const shrinkContainerWidthBy = (panelWidth, container, leftPanel = false) => {
  const containerWidth = getWidthAfterTransition(container);

  if (isIEEdge) {
    container.style.width = `${containerWidth - panelWidth}px`;
  }

  if (isIE11) {
    // Archive-IT:
    ////const scrollBarWidth = 17;
    ////container.style.width = `${containerWidth - panelWidth + scrollBarWidth}px`;
    const docNavNext = 22;
    if (leftPanel) {
      container.style.width = `${window.innerWidth - panelWidth - docNavNext}px`;
    } else {
      let leftPanelWidth = parseInt($('div[data-element="leftPanel"]').css('width'), 10);
      container.style.width = `${window.innerWidth - leftPanelWidth - panelWidth - docNavNext}px`;
    }
    // Archive-IT End:
  }
};

export const getClassNameInIE = ({ isHeaderOpen, isSearchOverlayOpen }) => [
  'DocumentContainer',
  isHeaderOpen ? 'full-height' : '',
  isSearchOverlayOpen ? 'search-overlay' : '',
].join(' ').trim();

export const handleWindowResize = ({ isLeftPanelOpen, isRightPanelOpen, leftPanelWidth = 300 }, container) => {
  const rightPanelWidth = 300;
  let width = window.innerWidth;

  // Archive-IT:
  if (isIE11) {
    leftPanelWidth = parseInt($('div[data-element="leftPanel"]').css('width'), 10);
    const docNavNext = 22;
    width -= docNavNext;
  }
  // Archive-IT End:

  if (isLeftPanelOpen) {
    width -= leftPanelWidth;
  }

  if (isRightPanelOpen) {
    width -= rightPanelWidth;
  }

  container.style.width = `${width}px`;
};
