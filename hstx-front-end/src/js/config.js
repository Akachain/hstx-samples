//export const HOST = "http://35.247.182.217:4000"
//export const API_URL_BASE = "http://35.247.182.217:4000/api/v1"

export const HOST = "https://akc-sdk-backend.akachain.io"
export const API_URL_BASE = "https://akc-sdk-backend.akachain.io/api/v1"

export const HEADER = {
    headers: {
        "Content-Type": "application/json",
        "secretkey": "akachain_cfg",
        "Access-Control-Allow-Origin": "*"
    }
}

export const URL_CREATE_SUPER_ADMIN = API_URL_BASE + "/CreateSuperAdmin"
export const URL_ALL_SUPER_ADMINS = API_URL_BASE + "/GetAllSuperAdmin"
export const URL_SUPER_ADMINS_BY_ID = API_URL_BASE + "/GetSuperAdminByID"

export const URL_ALL_ADMINS = API_URL_BASE + "/GetAllAdmin"

export const URL_CREATE_PROPOSAL = API_URL_BASE + "/CreateProposal"
export const URL_ALL_PROPOSALS = API_URL_BASE + "/GetAllProposal"
export const URL_PENDING_PROPOSAL = API_URL_BASE + "/GetPendingProposalBySuperAdminID"
export const URL_COMMIT_PROPOSAL = API_URL_BASE + "/CommitProposal"

export const URL_CREATE_APPROVAL = API_URL_BASE + "/CreateApproval"