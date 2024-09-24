const AssetAnnotation = (props) => {
  const { item,  removeAnnotation } = props;

  return (
    <div class="box-div">
      <button onClick={() => removeAnnotation(item)}>Remove Annotation {item.id}</button>
    </div>
  );
};

export default AssetAnnotation;
