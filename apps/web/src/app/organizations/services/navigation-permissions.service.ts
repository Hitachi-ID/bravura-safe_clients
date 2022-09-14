import { Permissions } from "@bitwarden/common/enums/permissions";
import { Organization } from "@bitwarden/common/models/domain/organization";

const permissions = {
  manage: [
    Permissions.CreateNewCollections,
    Permissions.EditAnyCollection,
    Permissions.DeleteAnyCollection,
    Permissions.EditAssignedCollections,
    Permissions.DeleteAssignedCollections,
    Permissions.AccessEventLogs,
    Permissions.ManageGroups,
    Permissions.ManageUsers,
    Permissions.ManagePolicies,
    Permissions.ManageScim,
  ],
  reports: [Permissions.AccessReports],
  tools: [Permissions.AccessImportExport],
  settings: [Permissions.ManageOrganization],
};

export class NavigationPermissionsService {
  static getPermissions(route: keyof typeof permissions | "admin") {
    if (route === "admin") {
      return Object.values(permissions).reduce((previous, current) => previous.concat(current), []);
    }

    return permissions[route];
  }

  static canAccessAdmin(organization: Organization): boolean {
    return (
      organization.canAccess ||
      this.canAccessTools(organization) ||
      this.canAccessSettings(organization) ||
      this.canAccessManage(organization) ||
      this.canAccessReports(organization)
    );
  }

  static canAccessReports(organization: Organization): boolean {
    return organization.hasAnyPermission(NavigationPermissionsService.getPermissions("reports"));
  }

  static canAccessTools(organization: Organization): boolean {
    return organization.hasAnyPermission(NavigationPermissionsService.getPermissions("tools"));
  }

  static canAccessSettings(organization: Organization): boolean {
    return organization.hasAnyPermission(NavigationPermissionsService.getPermissions("settings"));
  }

  static canAccessManage(organization: Organization): boolean {
    return organization.hasAnyPermission(NavigationPermissionsService.getPermissions("manage"));
  }
}
