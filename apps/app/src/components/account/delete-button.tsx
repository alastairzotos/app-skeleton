import React from "react";
import { useQuery } from "../../hooks/use-query";
import { deleteProfileRequest } from "../../requests/profiles";
import { useAuthState } from "../../state/auth";
import { handleLogout } from "../../utils/auth";
import { DoubleCheckButton } from "../lib/double-check-button";

export const DeleteAccountButton: React.FC = () => {
  const { profile } = useAuthState();
  const { request: deleteAccount, status: deleteAccountStatus } = useQuery(deleteProfileRequest);

  const handleDeleteClick = async () => {
    await deleteAccount(profile?.id!);
    await handleLogout();
  }

  return (
    <DoubleCheckButton
      title="Are you sure?"
      description="This will delete all of your sites, campaigns, and analytics. This action cannot be undone"
      text="Delete my account"
      confirmString="delete"
      disabled={deleteAccountStatus === 'fetching'}
      onConfirm={handleDeleteClick}
    />
  )
}