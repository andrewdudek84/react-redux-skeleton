const SelectedAsset = (props) => {
  const { item,  unselectAsset } = props;

  return (
    <div className="box-div" key={item}>
      <button onClick={() => unselectAsset(item)}>Unselect {item}</button>
    </div>
  );
};

export default SelectedAsset;
