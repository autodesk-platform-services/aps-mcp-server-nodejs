# Part 1: Prepare Service Account

In this part of the tutorial you will:

- Create a Secure Service Account (SSA) for your MCP server
- Generate a private key for authentication
- Invite the service account to your ACC projects
- Gather the required credentials for server configuration

## Create a Secure Service Account

> ### What is a Secure Service Account?
>
> A Secure Service Account (SSA) is a special type of account designed for server-to-server authentication with Autodesk Platform Services. Unlike traditional OAuth which requires user interaction, SSA uses public/private key cryptography to authenticate programmatically.
>
> Key benefits:
>
> - **No user interaction required** - Perfect for automated systems and AI assistants
> - **Granular permissions** - Control exactly what the service account can access
> - **Audit trail** - Track all actions performed by the service account
> - **Secure** - Uses industry-standard JWT tokens with private key signing

While you would typically implement the management of service accounts yourself using the [API](https://aps.autodesk.com/en/docs/ssa/v1/reference/http/), in this tutorial we'll use the [SSA Manager](https://ssa-manager.autodesk.io) demo application to quickly create a test account.

### Access SSA Manager

- Go to [https://ssa-manager.autodesk.io](https://ssa-manager.autodesk.io)
- Log in with your APS client ID and client secret
  - You can find these credentials under [https://aps.autodesk.com/myapps](https://aps.autodesk.com/myapps)

![SSA Manager Login](images/ssa-manager-login.png)

### Create a New Service Account

- Under the **Accounts** list, enter the first name and last name for your account
- Click the **Create Account With Name:** button

![Create Service Account](images/create-service-account.png)

### Note Your Service Account Details

- Make sure the new account is selected in the **Accounts** list
- Under **Account Details**, make note of the **serviceAccountId** and **email** values

![Service Account Details](images/service-account-details.png)

> Save these values for later - you'll need them for server configuration and ACC invitation.

## Generate a Private Key

Now you need to create a private key that your MCP server will use to authenticate as this service account.

### Create a New Private Key

- With your service account still selected in SSA Manager, click the **Create Key** button
- A `.pem` file with your newly generated private key will be automatically downloaded to your machine

![Create Private Key](images/create-private-key.png)

> Warning: Treat this `.pem` file like a password. Anyone with access to it can authenticate as your service account.

### Note Your Key Details

- Make sure the new key is selected in the **Keys** list
- Under **Key Details**, make note of the **kid** (private key ID) value

![Key Details](images/key-details.png)

> Note: The key ID uniquely identifies your private key and must be included in authentication requests.

## Provision Access to ACC

For your service account to access ACC projects, you need to invite it as a project member.

### Prerequisites

Make sure you have:

- [Provisioned your APS application for ACC access](https://get-started.aps.autodesk.com/#provision-access-in-other-products)
- Admin or similar permissions in your ACC projects

### Invite the Service Account to Your ACC Project

- Go to [Autodesk Construction Cloud](https://acc.autodesk.com/)
- Navigate to one of your projects
- Go to the **Members** section
- Click **Add Members**

![ACC Project Members](images/acc-project-members.png)

### Enter Service Account Email

- In the invitation dialog, enter the **email** of your service account, and click **Enter**
- Assign appropriate permissions (e.g., **Project Admin**, or more restricted roles)
- Click **Send invitations**

![Invite Service Account](images/invite-service-account.png)

> Note: Unlike regular users, service accounts don't need to accept invitations. They have immediate access once invited.

### Configure Folder Permissions

- While still in your ACC project, go to the **Files** section
- Click the three dots next to one of your folders, and select **Permission settings**

![Folder Permission Settings](images/folder-permission-settings.png)

- In the **Permissions** sidepanel, click **+ Add** to add a new permission
- In the **Add** dialog, select your service account user and pick the appropriate permission level
- Click the **Add** button to save this permission record

![Add Folder Permissions](images/add-folder-permissions.png)

## Gather Your Credentials

Before moving to the next part, make sure you have collected all the required information:

- **APS_CLIENT_ID** - Your APS application client ID
- **APS_CLIENT_SECRET** - Your APS application client secret
- **SSA_ID** - Your service account ID
- **SSA_KEY_ID** - Your private key ID
- **SSA_KEY_PATH** - Full path to your downloaded .pem file, for example, `/Users/username/Downloads/8a4ee790-3378-44f3-bbab-5acb35ec35ce.pem`

> Important: Keep these credentials secure. You'll use them to configure the MCP server in the next part.

## Troubleshooting

### Can't access SSA Manager

- Verify your APS application is of type **Server-to-Server**
  - Check at [https://aps.autodesk.com/myapps](https://aps.autodesk.com/myapps)
- Ensure you're using the correct client ID and secret

### Service account not appearing in ACC

- Make sure you've [provisioned your APS application for ACC access](https://get-started.aps.autodesk.com/#provision-access-in-other-products)
- Verify you used the exact email address from the SSA Manager
- Check that you have admin permissions in the ACC project

### Downloaded .pem file is missing

- Check your browser's download folder
- Some browsers may ask for permission to download files
- You can always create a new key if the file is lost
