import SingleOrderSection from "../../section/order/SingleOrderSection";
import { useParams } from "react-router-dom";

const SingleOrder = () => {
  const { id } = useParams();
  return <SingleOrderSection orderId={id} />;
};

export default SingleOrder;
