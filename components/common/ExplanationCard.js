import CardStyle from "../../styles/components/ExplanationCard.module.css";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import { createQueryParams } from "../../utils/utils";
import PuffLoader from "react-spinners/PuffLoader";
import LikeButton from "./LikeButton";
import Notification from "./Notification";
import useNotification from "../../hooks/useNotification";
import { useSelector } from "react-redux";

const setTitle = ({ title, subTitle, upperCase = true }) => {
  const mainText = upperCase ? title.toUpperCase() : title;

  if (subTitle !== "") {
    const subText = upperCase ? subTitle.toUpperCase() : subTitle;
    return `${mainText}-${subText}`;
  }
  return mainText;
};

const ExplanationCard = ({
  title = "",
  subTitle = "",
  definitions = [],
  sentences = [],
  _id,
  resources,
  resource_id,
}) => {
  const [fetchLikes, doFetchLikes] = useFetch({ count: 0, active: 0 });
  const notification = useNotification();
  const updateLikes = () => {
    if (_id) {
      const params = createQueryParams({
        [resource_id]: _id,
      });
      doFetchLikes(`${resources}/likes?${params}`);
    }
  };

  useEffect(() => {
    updateLikes();
  }, [_id]);

  const showErrNotification = (msg) => {
    notification.setText(msg);
    notification.setOpen(true);
  };

  const showLikeResultNotification = () => {
    let notiText;
    if (fetchLikes.data.active === 1) {
      notiText = "Removed in likes";
    } else {
      notiText = "Saved in likes";
    }
    notiText = `${notiText} - ${setTitle({
      title,
      subTitle,
      upperCase: false,
    })}`;
    notification.setText(notiText);
    notification.setOpen(true);
  };

  return (
    <div className={CardStyle.container}>
      <Notification {...notification} />
      <div className={CardStyle.head}>
        <h3 className={CardStyle.title}>{setTitle({ title, subTitle })}</h3>
        <div className={CardStyle.likeBox}>
          {fetchLikes.loading ? (
            <PuffLoader size={20} />
          ) : (
            <>
              <LikeButton
                active={fetchLikes.data.active === 1}
                resources={resources}
                _id={_id}
                successCallback={() => {
                  showLikeResultNotification();
                  updateLikes();
                }}
                failCallback={showErrNotification}
              />
              <p className={CardStyle.count}>{fetchLikes.data.count}</p>
            </>
          )}
        </div>
      </div>

      {definitions.length > 0 && (
        <>
          <p className={CardStyle.tag}>Definition</p>
          {definitions.map((definition) => (
            <p className={CardStyle.text} key={definition}>
              {definition}
            </p>
          ))}
        </>
      )}
      {sentences.length > 0 && (
        <>
          <p className={CardStyle.tag}>Examples</p>
          {sentences.map((sentence) => (
            <p className={CardStyle.text} key={sentence}>
              {sentence}
            </p>
          ))}
        </>
      )}
    </div>
  );
};

export default ExplanationCard;
