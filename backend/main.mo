import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserProfile = {
    principal : Principal;
    displayName : Text;
    registrationTimestamp : Time.Time;
  };

  type LoginEvent = {
    principal : Principal;
    timestamp : Time.Time;
    method : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  var loginEvents : [LoginEvent] = [];

  // Required by frontend: get the caller's own profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  // Required by frontend: save the caller's own profile
  public shared ({ caller }) func saveCallerUserProfile(displayName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save their profile");
    };
    let profile : UserProfile = {
      principal = caller;
      displayName;
      registrationTimestamp = switch (userProfiles.get(caller)) {
        case (?existing) { existing.registrationTimestamp };
        case (null) { Time.now() };
      };
    };
    userProfiles.add(caller, profile);
  };

  // Required by frontend: get another user's profile (own profile or admin)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  // Register a new user profile — open to guests so anyone can sign up
  public shared ({ caller }) func registerUser(displayName : Text) : async () {
    // No role check: guests can register (this is how they become users)
    if (userProfiles.containsKey(caller)) {
      Runtime.trap("User already registered");
    };

    let profile : UserProfile = {
      principal = caller;
      displayName;
      registrationTimestamp = Time.now();
    };

    userProfiles.add(caller, profile);
  };

  // Record a login event — users can only record their own events; admins can record for any principal
  public shared ({ caller }) func recordLoginEvent(principal : Principal, method : Text) : async () {
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only record your own login events");
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can record login events");
    };

    let event : LoginEvent = {
      principal;
      timestamp = Time.now();
      method;
    };

    loginEvents := loginEvents.concat([event]);
  };

  // Fetch login history for a principal — users can only see their own; admins can see anyone's
  public query ({ caller }) func getLoginHistory(principal : Principal) : async [LoginEvent] {
    if (caller != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own login history");
    };

    if (not userProfiles.containsKey(principal)) {
      Runtime.trap("User not found");
    };

    loginEvents.filter(func(event : LoginEvent) : Bool {
      event.principal == principal
    });
  };
};
