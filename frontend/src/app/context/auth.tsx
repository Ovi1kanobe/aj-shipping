import type { ExternalauthsResponse, UsersRecord, UsersResponse } from "../lib/pocketbase-types";
import React, { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "../hooks/useClient";
import PocketBaseError from "../lib/pberror";
import type { AuthMethodsList } from "pocketbase";

export interface AuthContextType {
  user: UsersResponse | null;
  setUser: (value: UsersResponse | null) => void;
  externalAuths: ExternalauthsResponse[] | null;
  fetched: boolean;
  sendVerificationEmail: (onError?: (e: PocketBaseError) => void, onSuccess?: () => void) => void;
  register: (
    email: string,
    password: string,
    passwordConfirm: string,
    onError: (error: PocketBaseError) => void,
    onSuccess: () => void,
    oneTimeCode?: string,
    firstName?: string,
    lastName?: string,
    phoneNumber?: string
  ) => void;
  requestPasswordReset: (
    email: string,
    onError: (error: PocketBaseError) => void,
    onSuccess: () => void
  ) => void;
  logout: () => void;
  loginWithPassword: (
    email: string,
    password: string,
    onError: (error: PocketBaseError) => void,
    onSuccess: () => void
  ) => void;
  loginWithOAuth: (
    provider: string,
    onError: (error: PocketBaseError) => void,
    onSuccess: () => void,
    oneTimeCode?: string
  ) => void;
  loginWithOTP: (
    otpId: string,
    otp: string,
    onError: (error: PocketBaseError) => void,
    onSuccess: () => void,
    mfaId?: string
  ) => void;
  fetchCurrentUser: (
    onError: (error: PocketBaseError) => void,
    onSuccess: (user: UsersResponse) => void
  ) => void;
  requestEmailChange: (
    newEmail: string,
    onError: (error: PocketBaseError) => void,
    onSuccess: () => void
  ) => void;
  updateUser: (
    data: Partial<UsersRecord>,
    onError: (error: PocketBaseError) => void,
    onSuccess?: (userRes: UsersResponse) => void
  ) => void;
  unlinkExternalAuth: (
    id: string,
    onError: (error: PocketBaseError) => void,
    onSuccess: () => void
  ) => void;
  fetchAuthMethods: (
    onError?: (e: PocketBaseError) => void,
    onSuccess?: (res: AuthMethodsList) => void
  ) => void;
  fetchExternalAuths: (
    onError?: (e: PocketBaseError) => void,
    onSuccess?: (res: ExternalauthsResponse[]) => void
  ) => void;
  requestOTP: (
    email: string,
    onError: (error: PocketBaseError) => void,
    onSuccess: (otpId: string) => void
  ) => void;
  setMFA: (
    mfaEnabled: boolean,
    onError: (error: PocketBaseError) => void,
    onSuccess: () => void
  ) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UsersResponse | null>(null);
  const { pb } = useClient();
  const [externalAuths, setExternalAuths] = useState<ExternalauthsResponse[] | null>(null);
  const [fetched, setFetched] = useState<boolean>(false);

  const fetchExternalAuths = useCallback(
    async (
      onError?: (e: PocketBaseError) => void,
      onSuccess?: (res: ExternalauthsResponse[]) => void
    ) => {
      try {
        const res = await pb.collection("_externalAuths").getFullList();
        if (onSuccess) onSuccess(res);
      } catch (e) {
        const error = e as PocketBaseError;
        if (error.isAbort) return;
        if (onError) onError(error);
      }
    },
    [pb]
  );

  const fetchAuthMethods = useCallback(
    async (onError?: (e: PocketBaseError) => void, onSuccess?: (res: AuthMethodsList) => void) => {
      try {
        const res = await pb.collection("users").listAuthMethods();
        if (onSuccess) onSuccess(res);
      } catch (e) {
        const error = e as PocketBaseError;
        if (error.isAbort) return;
        if (onError) onError(error);
      }
    },
    [pb]
  );

  const sendVerificationEmail = useCallback(
    async (onError?: (e: PocketBaseError) => void, onSuccess?: () => void) => {
      try {
        if (!user) {
          throw new PocketBaseError(
            "",
            404,
            { code: 1001, message: "User not set", data: {} },
            false,
            null
          );
        }
        await pb.collection("users").requestVerification(user.email);
        if (onSuccess) onSuccess();
      } catch (e) {
        const error = e as PocketBaseError;
        if (onError) onError(error);
      }
    },
    [pb, user]
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      passwordConfirm: string,
      onError: (error: PocketBaseError) => void,
      onSuccess: () => void,
      oneTimeCode?: string,
      firstName?: string,
      lastName?: string,
      phoneNumber?: string
    ) => {
      try {
        await pb.collection("users").create(
          {
            email,
            password,
            passwordConfirm,
            firstName,
            lastName,
            phoneNumber,
          },
          {
            query: { code: oneTimeCode },
          }
        );
        await pb.collection("users").requestVerification(email);
        onSuccess();
      } catch (error) {
        onError(error as PocketBaseError);
      }
    },
    [pb]
  );

  const requestPasswordReset = useCallback(
    async (email: string, onError: (error: PocketBaseError) => void, onSuccess: () => void) => {
      try {
        await pb.collection("users").requestPasswordReset(email);
        onSuccess();
      } catch (error) {
        onError(error as PocketBaseError);
      }
    },
    [pb]
  );

  const logout = useCallback(() => {
    pb.authStore.clear();
    setUser(null);
    setExternalAuths(null);
    setFetched(true);
  }, [pb]);

  const loginWithPassword = useCallback(
    async (
      email: string,
      password: string,
      onError: (error: PocketBaseError) => void,
      onSuccess: () => void
    ) => {
      try {
        const res = await pb.collection("users").authWithPassword(email, password);
        setUser(res.record);
        onSuccess();
      } catch (error) {
        onError(error as PocketBaseError);
      }
    },
    [pb]
  );

  const requestOTP = useCallback(
    async (
      email: string,
      onError: (error: PocketBaseError) => void,
      onSuccess: (otpId: string) => void
    ) => {
      try {
        const result = await pb.collection("users").requestOTP(email);
        onSuccess(result.otpId);
      } catch (error) {
        onError(error as PocketBaseError);
      }
    },
    [pb]
  );

  const loginWithOTP = useCallback(
    async (
      otpId: string,
      otp: string,
      onError: (error: PocketBaseError) => void,
      onSuccess: () => void,
      mfaId?: string
    ) => {
      try {
        const res = await pb.collection("users").authWithOTP(otpId, otp, { mfaId: mfaId });
        setUser(res.record);
        onSuccess();
      } catch (error) {
        onError(error as PocketBaseError);
      }
    },
    [pb]
  );

  const fetchCurrentUser = useCallback(
    async (onError: (error: PocketBaseError) => void, onSuccess: (user: UsersResponse) => void) => {
      try {
        if (!pb.authStore.isValid || !pb.authStore.record) {
          throw new PocketBaseError(
            "Auth failed",
            401,
            { code: 1001, message: "Error Fetching User, Could not validate authstore", data: {} },
            false,
            null
          );
        }
        const id = pb.authStore.record.id;
        const user = await pb.collection("users").getOne(id);
        onSuccess(user);
      } catch (e) {
        const error = e as PocketBaseError;
        if (error.isAbort) return;
        if (onError) onError(error);
      }
    },
    [pb]
  );

  const loginWithOAuth = useCallback(
    async (
      provider: string,
      onError: (error: PocketBaseError) => void,
      onSuccess: () => void,
      oneTimeCode?: string
    ) => {
      try {
        const res = await pb
          .collection("users")
          .authWithOAuth2({ provider, query: { code: oneTimeCode } });
        setUser(res.record);
        onSuccess();
      } catch (error) {
        onError(error as PocketBaseError);
      }
    },
    [pb]
  );

  const requestEmailChange = useCallback(
    async (newEmail: string, onError: (error: PocketBaseError) => void, onSuccess: () => void) => {
      try {
        await pb.collection("users").requestEmailChange(newEmail);
        onSuccess();
      } catch (e) {
        const error = e as PocketBaseError;
        onError(error);
      }
    },
    [pb]
  );

  const updateUser = useCallback(
    async (
      data: Partial<UsersRecord>,
      onError: (error: PocketBaseError) => void,
      onSuccess?: (userRes: UsersResponse) => void
    ) => {
      if (!user) {
        onError(
          new PocketBaseError(
            "User not found",
            404,
            { code: 1001, message: "User not found on client", data: {} },
            false,
            null
          )
        );
        return;
      }
      try {
        const userRes = await pb.collection("users").update(user.id, data);
        setUser(userRes);
        if (onSuccess) onSuccess(userRes);
      } catch (e) {
        const error = e as PocketBaseError;
        onError(error);
      }
    },
    [pb, user]
  );

  const unlinkExternalAuth = useCallback(
    async (id: string, onError: (error: PocketBaseError) => void, onSuccess: () => void) => {
      try {
        await pb.collection("_externalAuths").delete(id);
        setExternalAuths((prev) => prev?.filter((auth) => auth.id !== id) || null);
        onSuccess();
      } catch (e) {
        const error = e as PocketBaseError;
        onError(error);
      }
    },
    [pb]
  );

  const setMFA = useCallback(
    async (
      mfaEnabled: boolean,
      onError: (error: PocketBaseError) => void,
      onSuccess: () => void
    ) => {
      try {
        const res = await pb
          .collection("users")
          .update(user?.id as string, { mfaEnabled: mfaEnabled });
        setUser(res);
        onSuccess();
      } catch (e) {
        const error = e as PocketBaseError;
        onError(error);
      }
    },
    [pb, user]
  );

  useEffect(() => {
    fetchCurrentUser(
      () => {
        setFetched(true);
      },
      (user) => {
        setUser(user);
        setFetched(true);
      }
    );
    const removeListener = pb.authStore.onChange((token: string, record: unknown) => {
      if (import.meta.env.DEV) {
        console.debug("AuthStore changed:", token, record);
      }
      fetchCurrentUser(
        () => {
          setFetched(true);
          setUser(null);
        },
        (user) => {
          setUser(user);
          setFetched(true);
        }
      );
    });
    return () => {
      removeListener();
    };
  }, [fetchCurrentUser, pb.authStore]);

  useEffect(() => {
    if (!user?.id) return;
    if (import.meta.env.DEV) {
      console.debug("user has changed, fetching external auths", user.id);
    }
    fetchExternalAuths(
      (error) => {
        console.error("Error fetching external auths:", error);
      },
      (externalAuths) => {
        setExternalAuths(externalAuths);
      }
    );
  }, [user?.id, fetchExternalAuths, pb.authStore]);

  const ctxValue: AuthContextType = useMemo(
    () => ({
      user,
      setUser,
      externalAuths,
      fetched,
      sendVerificationEmail,
      register,
      requestPasswordReset,
      logout,
      loginWithPassword,
      loginWithOAuth,
      fetchCurrentUser,
      unlinkExternalAuth,
      requestEmailChange,
      updateUser,
      fetchAuthMethods,
      fetchExternalAuths,
      requestOTP,
      loginWithOTP,
      setMFA,
    }),
    [
      user,
      externalAuths,
      fetched,
      sendVerificationEmail,
      register,
      requestPasswordReset,
      logout,
      loginWithPassword,
      loginWithOAuth,
      fetchCurrentUser,
      unlinkExternalAuth,
      requestEmailChange,
      updateUser,
      fetchAuthMethods,
      fetchExternalAuths,
      requestOTP,
      loginWithOTP,
      setMFA,
    ]
  );

  if (!pb) return null;

  return <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>;
}