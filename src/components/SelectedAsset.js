const SelectedAsset = (props) => {
  const { item,  unselectAsset } = props;

  return (
    <div class="box-div">
      <button onClick={() => unselectAsset(item)}>Unselect {item}</button>
    </div>
  );
};

export default SelectedAsset;
