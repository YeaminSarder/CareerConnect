export const Error = (props) => {
  return props.message && (
    <div className={`bg-danger mb-2 text-white p-2 rounded ${props.className ?? ""}`}>
      <p>{props.message}</p>
    </div>
  );
}