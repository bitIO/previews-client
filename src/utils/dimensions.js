import { Dropdown } from "semantic-ui-react";

const dimensions = [
  {
    id: 1,
    width: 414,
    height: 736,
    isMobile: true,
    isLandscape: false,
    deviceName: "iPhone-6-7-8-plus",
  },
  {
    id: 2,
    width: 736,
    height: 736,
    isMobile: true,
    isLandscape: true,
    deviceName: "iPhone-6-7-8-plus",
  },
  {
    id: 3,
    width: 375,
    height: 812,
    isMobile: true,
    isLandscape: false,
    deviceName: "iPhone-X",
  },
  {
    id: 4,
    width: 812,
    height: 375,
    isMobile: true,
    isLandscape: true,
    deviceName: "iPhone-X",
  },
  {
    id: 5,
    width: 768,
    height: 1024,
    isMobile: true,
    isLandscape: false,
    deviceName: "iPad",
  },
  {
    id: 6,
    width: 1024,
    height: 768,
    isMobile: true,
    isLandscape: true,
    deviceName: "iPad",
  },
  {
    id: 7,
    width: 1024,
    height: 1366,
    isMobile: true,
    isLandscape: false,
    deviceName: "iPad Pro",
  },
  {
    id: 8,
    width: 1366,
    height: 1024,
    isMobile: true,
    isLandscape: true,
    deviceName: "iPad Pro",
  },
  {
    id: 9,
    width: 1440,
    height: 764,
    isMobile: false,
    isLandscape: false,
    deviceName: "laptop",
  },
];
const dimensionsDropdownOptions = [
  {
    key: "all",
    text: "All resolutions",
    value: 0,
  },
];
dimensions.forEach((item) => {
  dimensionsDropdownOptions.push({
    key: `${item.deviceName}-${item.width}x${item.height}`,
    text: `${item.deviceName} ${item.width}x${item.height}`,
    value: item.id,
  });
});

function getDimensions(keys) {
  return dimensions.filter((d) => keys.indexOf(d.id) !== -1);
}

function setDropdownValue(values, setDimensions) {
  console.log("Updating dimensions", values);
  if (values.length === 0) {
    setDimensions([0]);
  } else if (values.length >= 1) {
    setDimensions(values.filter((d) => d !== 0));
  }
}

function renderDropdown(value, setDimensions) {
  return (
    <Dropdown
      placeholder="Select dimensions"
      fluid
      multiple
      search
      selection
      options={dimensionsDropdownOptions}
      style={{ minWidth: "200px" }}
      value={value}
      onChange={(e, data) => {
        console.log("dimensions dropdown changed", value, data);
        console.log(e);
        setDropdownValue(data.value, setDimensions);
      }}
    ></Dropdown>
  );
}

export { dimensions, dimensionsDropdownOptions, getDimensions, renderDropdown };
