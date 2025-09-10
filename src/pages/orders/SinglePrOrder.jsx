import PrOrderDetails from "../../section/order/SinglePrOrderSection";
import { useParams } from "react-router-dom";

const SinglePrOrder = () => {
  const { id } = useParams();
  return <PrOrderDetails orderId={id} />;
};

export default SinglePrOrder;
