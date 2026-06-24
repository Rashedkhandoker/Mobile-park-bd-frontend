import QuickViewButton from './hoverButton/QuickViewButton';

const ProductHoverButton = ({ productstate, listClass, actionsToHide }) => {
  return (
    <ul className="hover-action">
      <QuickViewButton productstate={productstate} />
    </ul>
  );
};

export default ProductHoverButton;
