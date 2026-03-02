import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface UserProfile {
    principal: Principal;
    displayName: string;
    registrationTimestamp: Time;
}
export interface LoginEvent {
    method: string;
    principal: Principal;
    timestamp: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLoginHistory(principal: Principal): Promise<Array<LoginEvent>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordLoginEvent(principal: Principal, method: string): Promise<void>;
    registerUser(displayName: string): Promise<void>;
    saveCallerUserProfile(displayName: string): Promise<void>;
}
