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
import { ShareModal } from "./ShareModal"; // 👈 Import your new share modal component

interface ActionContainerProps {
  uuid: string;
}

const EMPTY_ARRAY: any[] = [];
// ========================================
export const ActionContainer: React.FC<ActionContainerProps> = ({ uuid }) => {
  const dispatch = useDispatch();
  const { userUuid } = useAuthStore() as { userUuid: string | null };

  // Redux state selectors
  const comments = useSelector((state: RootState) => state.interactions.commentsByTask[uuid] || EMPTY_ARRAY);
  const isLiked = useSelector((state: RootState) => state.interactions.isLikedByTask[uuid] || false);
  const customLikesCount = useSelector((state: RootState) => state.interactions.likesCountByTask[uuid] || 0);

  const isShared = useSelector((state: RootState) => state.interactions.isSharedByTask[uuid] || false);
  const customSharesCount = useSelector((state: RootState) => state.interactions.sharesCountByTask[uuid] || 0);

  const [baseLikes, setBaseLikes] = useState<number>(0);
  const [baseShares, setBaseShares] = useState<number>(0);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false); // 👈 Modal open state

  const shareUrl = `${window.location.origin}/homefeed`;

  // Fetch backend interactions on mount
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

    return () => {
      isMounted = false;
    };
  }, [uuid, dispatch]);

  // 1. Handle Like with Backend Sync
  const handleLikeClick = async () => {
    if (!userUuid) {
      console.warn("Cannot like: User not authenticated");
      return;
    }

    // Optimistic Redux update (updates UI instantly)
    dispatch(toggleLike(uuid));

    try {
      await postTaskInteractionApi(uuid, "TOGGLE_LIKE", {
        userUuid,
      });
    } catch (err) {
      console.error("Failed to sync like interaction", err);
    }
  };

  // 2. Handle Successful Share (Triggered when user clicks "Copy" inside the modal)
  const handleSuccessfulShare = async () => {
    if (!userUuid) {
      console.warn("Cannot share: User not authenticated");
      return;
    }

    try {
      setCopied(true);
      
      // Optimistic Redux update (turns the button green via `isShared`)
      dispatch(toggleShare(uuid));
      setTimeout(() => setCopied(false), 2000);

      // Send share action with userUuid to backend
      await postTaskInteractionApi(uuid, "TOGGLE_SHARE", {
        userUuid,
      });
    } catch (err) {
      console.error("Failed to process share action", err);
    }
  };

  return (
    <>
      <TaskActionForm
        uuid={uuid}
        isLiked={isLiked}
        totalLikes={baseLikes + customLikesCount}
        commentsCount={comments.length}
        hasComments={comments.length > 0}
        isShared={isShared}
        totalShares={baseShares + customSharesCount}
        copied={copied}
        isDrawerOpen={isDrawerOpen}
        onLike={handleLikeClick}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onCloseDrawer={() => setIsDrawerOpen(false)}
        onShare={() => setIsShareModalOpen(true)} // 👈 Opens the modal instead of instantly copying
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={shareUrl}
        onSuccessfulShare={handleSuccessfulShare}
      />
    </>
  );
};