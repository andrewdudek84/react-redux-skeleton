const AssetAnnotation = (props) => {
  const { item,  removeAnnotation } = props;

  return (
    <div className="box-div" key={item.id}>
      <button onClick={() => removeAnnotation(item)}>Remove Annotation {item.id}</button>
    </div>
  );
};

export default AssetAnnotation;
