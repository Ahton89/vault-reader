const core = require("@actions/core");

const vault = require("node-vault");

async function vaultAuthenticate(
  vaultClient,
  argVaultRoleId,
  argVaultSecretId,
) {
  try {
    const authResponse = await vaultClient.approleLogin({
      role_id: argVaultRoleId,
      secret_id: argVaultSecretId,
    });

    vaultClient.token = authResponse.auth.client_token;

    return authResponse.auth.client_token;
  } catch (error) {
    throw new Error("vaultAuthenticate: " + error.message);
  }
}

async function vaultGetSecret(
  vaultClient,
  argVaultPath,
  argVaultSecretVersion,
) {
  try {
    const readString =
      argVaultSecretVersion !== ""
        ? `${argVaultPath}?version=${argVaultSecretVersion}`
        : argVaultPath;

    const secretResponse = await vaultClient.read(readString);

    return JSON.stringify(secretResponse.data?.data);
  } catch (error) {
    throw new Error("vaultGetSecret: " + error.message);
  }
}

async function run() {
  try {
    const argVaultAddress = core.getInput("vault_addr");
    const argVaultPath = core.getInput("vault_path");
    const argVaultRoleId = core.getInput("vault_role_id");
    const argVaultSecretId = core.getInput("vault_secret_id");
    const argVaultSecretVersion = core.getInput("vault_secret_version");
    const argToBase64 = core.getInput("to_base64");

    const vaultClient = vault({
      apiVersion: "v1",
      endpoint: argVaultAddress,
    });

    await vaultAuthenticate(vaultClient, argVaultRoleId, argVaultSecretId);

    let secretValue = await vaultGetSecret(
      vaultClient,
      argVaultPath,
      argVaultSecretVersion,
    );

    if (argToBase64) {
      secretValue = Buffer.from(secretValue).toString("base64");
    }

    core.setOutput("data", secretValue);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
