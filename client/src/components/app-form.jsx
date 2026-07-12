import Form from "react-bootstrap/Form";

const AppForm = (props) => {
  return (
    <Form
      className={`max-w-sm m-auto ${props.className ?? ""}`}
      {...props}
    />
  );
}

const AppFormHeader = (props) => {
  return (
    <Form.Label
      className={`block text-gray-700 text-lg font-bold mb-4 ${props.className ?? ""}`}
      {...props}
    />
  );
}

const AppFormGroup = (props) => {
  return (
    <Form.Group
      className={`mb-4 ${props.className ?? ""}`}
      {...props}
    />
  );
}

const AppFormLabel = (props) => {
  return (
    <Form.Label
      className={`block text-gray-700 font-medium mb-2 ${props.className ?? ""}`}
      {...props}
    />
  );
}

const AppFormControl = (props) => {
  return (
    <Form.Control
      className={`rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 ${props.className ?? ""}`}
      {...props}
    />
  );
}

export default {
  Form: AppForm,
  Group: AppFormGroup,
  Label: AppFormLabel,
  Control: AppFormControl,
  Header: AppFormHeader,
};