package handler

import (
	"encoding/json"
	"fmt"
	"reflect"

	"github.com/Akachain/akc-go-sdk/common"
	"github.com/Akachain/akc-go-sdk/hstx/model"
	"github.com/Akachain/akc-go-sdk/util"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
	"github.com/mitchellh/mapstructure"
)

// ProposalHanler ...
type ProposalHanler struct{}

// CreateProposal ...
func (sah *ProposalHanler) CreateProposal(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	util.CheckChaincodeFunctionCallWellFormedness(args, 1)

	common.Logger.Infof("Create Proposal: %+v\n", args)

	proposal := new(model.Proposal)
	err := json.Unmarshal([]byte(args[0]), proposal)
	if err != nil {
		// Return error: can't unmashal json
		return common.RespondError(common.ResponseError{
			ResCode: common.ERR3,
			Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR3], err.Error(), common.GetLine()),
		})
	}

	proposal.ProposalID = stub.GetTxID()
	proposal.Status = "Pending"

	common.Logger.Infof("Create Proposal: %+v\n", proposal)
	err = util.Createdata(stub, model.ProposalTable, []string{proposal.ProposalID}, &proposal)
	if err != nil {
		resErr := common.ResponseError{
			ResCode: common.ERR5,
			Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR5], err.Error(), common.GetLine()),
		}
		return common.RespondError(resErr)
	}

	bytes, err := json.Marshal(proposal)
	if err != nil {
		// Return error: can't mashal json
		return common.RespondError(common.ResponseError{
			ResCode: common.ERR5,
			Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR5], err.Error(), common.GetLine()),
		})
	}

	resSuc := common.ResponseSuccess{
		ResCode: common.SUCCESS,
		Msg:     common.ResCodeDict[common.SUCCESS],
		Payload: string(bytes)}
	return common.RespondSuccess(resSuc)
}

// GetAllProposal ...
func (sah *ProposalHanler) GetAllProposal(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	res := util.GetAllData(stub, new(model.Proposal), model.ProposalTable)
	return res
}

// GetProposalByID ...
func (sah *ProposalHanler) GetProposalByID(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	util.CheckChaincodeFunctionCallWellFormedness(args, 1)

	proposalID := args[0]
	res := util.GetDataByID(stub, proposalID, new(model.Proposal), model.ProposalTable)
	return res
}

// GetPendingProposalBySuperAdminID ...
func (sah *ProposalHanler) GetPendingProposalBySuperAdminID(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	util.CheckChaincodeFunctionCallWellFormedness(args, 1)

	superAdminID := args[0]
	proposalList := []model.Proposal{}

	queryStr := fmt.Sprintf("{\"selector\": {\"_id\": {\"$regex\": \"%s\"},\"$or\": [{\"Status\": \"Pending\"},{\"Status\": \"Approved\"}]}}", model.ProposalTable)
	resultsIterator, err := stub.GetQueryResult(queryStr)
	if err != nil {
		resErr := common.ResponseError{common.ERR4, fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR4], err.Error(), common.GetLine())}
		return common.RespondError(resErr)
	}
	defer resultsIterator.Close()
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			resErr := common.ResponseError{common.ERR4, fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR4], err.Error(), common.GetLine())}
			return common.RespondError(resErr)
		}

		proposal := new(model.Proposal)
		err = json.Unmarshal(queryResponse.Value, proposal)
		if err != nil {
			//convert JSON eror
			resErr := common.ResponseError{common.ERR3, fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR3], err.Error(), common.GetLine())}
			return common.RespondError(resErr)
		}
		proposalList = append(proposalList, *proposal)
	}

	for i := len(proposalList) - 1; i >= 0; i-- {
		proposal := proposalList[i]
		rs, err := util.GetByTwoColumns(stub, model.ApprovalTable, "ProposalID", fmt.Sprintf("\"%s\"", proposal.ProposalID), "ApproverID", fmt.Sprintf("\"%s\"", superAdminID))
		if err != nil {
			resErr := common.ResponseError{common.ERR4, fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR4], err.Error(), common.GetLine())}
			return common.RespondError(resErr)
		}
		if rs.HasNext() {
			proposalList[i] = proposalList[len(proposalList)-1]
			proposalList = proposalList[:len(proposalList)-1]
		}
	}

	bytes, err := json.Marshal(proposalList)
	if err != nil {
		// Return error: can't mashal json
		return common.RespondError(common.ResponseError{
			ResCode: common.ERR5,
			Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR5], err.Error(), common.GetLine()),
		})
	}

	resSuc := common.ResponseSuccess{
		ResCode: common.SUCCESS,
		Msg:     common.ResCodeDict[common.SUCCESS],
		Payload: string(bytes)}
	return common.RespondSuccess(resSuc)
}

//UpdateProposal ...
func (sah *ProposalHanler) UpdateProposal(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	util.CheckChaincodeFunctionCallWellFormedness(args, 1)

	tmpProposal := new(model.Proposal)
	err := json.Unmarshal([]byte(args[0]), tmpProposal)
	if err != nil {
		// Return error: can't unmashal json
		return common.RespondError(common.ResponseError{
			ResCode: common.ERR3,
			Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR3], err.Error(), common.GetLine()),
		})
	}

	if len(tmpProposal.ProposalID) == 0 {
		resErr := common.ResponseError{
			ResCode: common.ERR13,
			Msg:     fmt.Sprintf("%s %s", common.ResCodeDict[common.ERR13], err.Error()),
		}
		return common.RespondError(resErr)
	}

	//get proposal information
	rawProposal, err := util.Getdatabyid(stub, tmpProposal.ProposalID, model.ProposalTable)
	if err != nil {
		resErr := common.ResponseError{
			ResCode: common.ERR4,
			Msg:     fmt.Sprintf("%s %s", common.ResCodeDict[common.ERR4], err.Error()),
		}
		return common.RespondError(resErr)
	}

	proposal := new(model.Proposal)
	mapstructure.Decode(rawProposal, proposal)

	tmpProposalVal := reflect.ValueOf(tmpProposal).Elem()
	proposalVal := reflect.ValueOf(proposal).Elem()
	for i := 0; i < tmpProposalVal.NumField(); i++ {
		fieldName := tmpProposalVal.Type().Field(i).Name
		if len(tmpProposalVal.Field(i).String()) > 0 {
			field := proposalVal.FieldByName(fieldName)
			if field.CanSet() {
				field.SetString(tmpProposalVal.Field(i).String())
			}
		}
	}

	err = util.Changeinfo(stub, model.ProposalTable, []string{proposal.ProposalID}, proposal)
	if err != nil {
		//Overwrite fail
		resErr := common.ResponseError{
			ResCode: common.ERR5,
			Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR5], err.Error(), common.GetLine()),
		}
		return common.RespondError(resErr)
	}

	bytes, err := json.Marshal(proposal)
	if err != nil {
		// Return error: can't mashal json
		return common.RespondError(common.ResponseError{
			ResCode: common.ERR5,
			Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR5], err.Error(), common.GetLine()),
		})
	}

	resSuc := common.ResponseSuccess{
		ResCode: common.SUCCESS,
		Msg:     common.ResCodeDict[common.SUCCESS],
		Payload: string(bytes)}
	return common.RespondSuccess(resSuc)
}

//CommitProposal ...
func (sah *ProposalHanler) CommitProposal(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	util.CheckChaincodeFunctionCallWellFormedness(args, 1)

	tmpProposal := new(model.Proposal)
	err := json.Unmarshal([]byte(args[0]), tmpProposal)
	if err != nil {
		// Return error: can't unmashal json
		return common.RespondError(common.ResponseError{
			ResCode: common.ERR3,
			Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR3], err.Error(), common.GetLine()),
		})
	}

	if len(tmpProposal.ProposalID) == 0 {
		resErr := common.ResponseError{
			ResCode: common.ERR13,
			Msg:     fmt.Sprintf("%s %s", common.ResCodeDict[common.ERR13], err.Error()),
		}
		return common.RespondError(resErr)
	}

	resIterator, err := util.GetByOneColumn(stub, model.ApprovalTable, "ProposalID", fmt.Sprintf("\"%s\"", tmpProposal.ProposalID))
	if err != nil {
		resErr := common.ResponseError{
			ResCode: common.ERR13,
			Msg:     fmt.Sprintf("%s %s", common.ResCodeDict[common.ERR13], err.Error()),
		}
		return common.RespondError(resErr)
	}
	defer resIterator.Close()
	count := 0
	for resIterator.HasNext() {
		_, err := resIterator.Next()
		if err != nil {
			resErr := common.ResponseError{
				ResCode: common.ERR13,
				Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR13], err.Error(), common.GetLine()),
			}
			return common.RespondError(resErr)
		}
		count++
	}
	if count < 2 {
		resErr := common.ResponseError{
			ResCode: common.ERR13,
			Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR5], "The proposal haven't gotten engouh approval yet.", common.GetLine()),
		}
		return common.RespondError(resErr)
	}

	//get proposal information
	rawProposal, err := util.Getdatabyid(stub, tmpProposal.ProposalID, model.ProposalTable)
	if err != nil {
		resErr := common.ResponseError{
			ResCode: common.ERR4,
			Msg:     fmt.Sprintf("%s %s", common.ResCodeDict[common.ERR4], err.Error()),
		}
		return common.RespondError(resErr)
	}

	proposal := new(model.Proposal)
	mapstructure.Decode(rawProposal, proposal)

	proposal.Status = "Committed"
	proposal.UpdatedAt = tmpProposal.UpdatedAt

	err = util.Changeinfo(stub, model.ProposalTable, []string{proposal.ProposalID}, proposal)
	if err != nil {
		//Overwrite fail
		resErr := common.ResponseError{
			ResCode: common.ERR5,
			Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR5], err.Error(), common.GetLine()),
		}
		return common.RespondError(resErr)
	}

	bytes, err := json.Marshal(proposal)
	if err != nil {
		// Return error: can't mashal json
		return common.RespondError(common.ResponseError{
			ResCode: common.ERR5,
			Msg:     fmt.Sprintf("%s %s %s", common.ResCodeDict[common.ERR5], err.Error(), common.GetLine()),
		})
	}

	resSuc := common.ResponseSuccess{
		ResCode: common.SUCCESS,
		Msg:     common.ResCodeDict[common.SUCCESS],
		Payload: string(bytes)}
	return common.RespondSuccess(resSuc)
}
