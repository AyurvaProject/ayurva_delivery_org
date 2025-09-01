import { useState, useEffect } from "react";
import { GetDeliveryPersonById } from "../../apis/deliveryPerson/DeliveryPerson";
import { useParams } from "react-router-dom";
import DeliveryPersonDetailSection from "../../section/deliveryPerson/DeliveryPersonEditForm";
import LoadingSection from "../../section/loading/LoadingSection";
const SinglePerson = () => {
  const { id } = useParams();
  const [person, setPerson] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetDeliveryPersonById(id).then((response) => {
      setPerson(response);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <LoadingSection />;
  }
  return <DeliveryPersonDetailSection initialData={person} />;
};

export default SinglePerson;
