// components/LoadingComponent.jsx
const FullPageLoader = () => {
  return (
    <div className="loader-container">
      <div className="star-spinner">
        {/* These 8 divs create the 'star' bars */}
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  );
};
export default FullPageLoader;
