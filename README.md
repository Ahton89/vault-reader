# VAULT-READER

A GitHub Action to read all keys/values of secret from Vault as JSON.

## Usage

```yaml
name: Read secret
on:
  push:
    branches:
      - "*"
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      - name: Write to file
        uses: Ahton89/vault-reader@v0.0.1
        with:
          vault_addr: ${{ secrets.VAULT_ADDR }}
          vault_path: ${{ secrets.VAULT_PATH }}
          vault_role_id: ${{ secrets.VAULT_ROLE_ID }}
          vault_secret_id: ${{ secrets.VAULT_SECRET_ID }}
```

### 📥 Inputs

#### Vault

- **vault_addr** _(required)_ - Vault address.
- **vault_path** _(required)_ - Path to the secret
- **vault_role_id** _(required)_ - Role id for auth in the Vault
- **vault_secret_id** _(required)_ - Secret id for auth in the Vault
- **vault_secret_version** _(optional)_ - If empty - uses last version of secret.

### 📤 Outputs

- **data** - Generated auth from vault secret.

#### Created with ❤️ for everyone :)
