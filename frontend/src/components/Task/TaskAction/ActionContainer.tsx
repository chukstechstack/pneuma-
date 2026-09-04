import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store/ReduxStore";
import { toggleShare, toggleLike, setTaskInteractions } from "../../../hooks/interactionsSlice";
import { useAuthStore } from "@store/useAuthStore";
import { 
  fetchTaskInteractionsApi, 
  postTaskInteractionApi 
} from "../../../services/InteractionServices/interactionsService";
import { TaskActionForm } from "./Form";
import { ShareModal } from "./ShareModal";

interface ActionContainerProps {
  uuid: string;
  onOpenComments: () => void;
}

const EMPTY_ARRAY: any[] = [];

export const ActionContainer: React.FC<ActionContainerProps> = ({ uuid, onOpenComments }) => {
  const dispatch = useDispatch();
  const { userUuid } = useAuthStore() as { userUuid: string | null };

  const comments = useSelector((state: RootState) => state.interactions.commentsByTask[uuid] || EMPTY_ARRAY);
  const isLiked = useSelector((state: RootState) => state.interactions.isLikedByTask[uuid] || false);
  const customLikesCount = useSelector((state: RootState) => state.interactions.likesCountByTask[uuid] || 0);

  const isShared = useSelector((state: RootState) => state.interactions.isSharedByTask[uuid] || false);
  const customSharesCount = useSelector((state: RootState) => state.interactions.sharesCountByTask[uuid] || 0);

  const [baseLikes, setBaseLikes] = useState<number>(0);
  const [baseShares, setBaseShares] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const shareUrl = `${window.location.origin}/homefeed`;

  useEffect(() => {
    let isMounted = true;
    const loadInteractions = async () => {
      try {
        const data = await fetchTaskInteractionsApi(uuid);
        if (data && isMounted) {
          setBaseLikes(data.likes_count || 0);
          setBaseShares(data.shares_count || 0);
          dispatch(
            setTaskInteractions({
              taskUuid: uuid,
              likes_count: data.likes_count,
              shares_count: data.shares_count,
              comments: data.comments,
            })
          );
        }
      } catch (err) {
        console.error("Failed to load task interactions:", err);
      }
    };
    loadInteractions();
    return () => { isMounted = false; };
  }, [uuid, dispatch]);

  const handleLikeClick = async () => {
    if (!userUuid) return;
    dispatch(toggleLike(uuid));
    try {
      await postTaskInteractionApi(uuid, "TOGGLE_LIKE", { userUuid });
    } catch (err) {
      console.error("Failed to sync like interaction", err);
    }
  };

  const handleSuccessfulShare = async () => {
    if (!userUuid) return;
    try {
      setCopied(true);
      dispatch(toggleShare(uuid));
      setTimeout(() => setCopied(2000 as unknown as boolean), 2000);
      await postTaskInteractionApi(uuid, "TOGGLE_SHARE", { userUuid });
    } catch (err) {
      console.error("Failed to process share action", err);
    }
  };

  return (
    <div className="select-none">
      <TaskActionForm
        uuid={uuid}
        isLiked={isLiked}
        totalLikes={baseLikes + customLikesCount}
        commentsCount={comments.length}
        hasComments={comments.length > 0}
        isShared={isShared}
        totalShares={baseShares + customSharesCount}
        copied={copied}
        onLike={handleLikeClick}
        onOpenDrawer={onOpenComments}
        onShare={() => setIsShareModalOpen(true)}
        isFloatingOverlay={true}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={shareUrl}
        onSuccessfulShare={handleSuccessfulShare}
      />
    </div>
  );
};