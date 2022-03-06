/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */


'use strict';

const {Contract} = require('fabric-contract-api');

class Transaction extends Contract {

    async initLedger(ctx) {
        const PakVotingSystem = [
            {
                sid: 'S01',
                name: 'votes',
                loc : 'Pak'
            }, {
                sid: 'S02',
                name: 'votes',
                loc : 'Pak'
            }
        ];

        for (let i = 0; i < PakVotingSystem.length; i++) {
            await ctx.stub.putState('Assets' + i, Buffer.from(JSON.stringify(PakVotingSystem[i])));
            console.info('Added <--> ', PakVotingSystem[i]);
        }
    }
/**
 * 
 * @param {*} ctx 
 * @param {*} voterId 
 * @param {*} candidateId 
 * @param {*} timestamp 
 */
    async voteCastedByVoter(ctx, voterId, candidateId, timestamp) {
        const transaction = {
            voterId ,
            docType: 'VoteCastedByVoter',
            organization : 'PakVotingSystem',
            candidateId,
            timestamp
        };
        await ctx.stub.putState(voterId, Buffer.from(JSON.stringify(transaction)));
    }
    /**
     * 
     * @param {*} ctx 
     * @param {*} party 
     * @param {*} punjab 
     * @param {*} kpk 
     * @param {*} sindh 
     * @param {*} balochistan 
     * @param {*} totalVotes 
     * @param {*} timestamp 
     */
    async winningPartyByProvince(ctx, party, punjab, kpk, sindh, balochistan, totalVotes, timestamp) {
        const transaction = {
            docType: 'WinningPartyByProvince',
            organization : 'PakVotingSystem',
            punjab,
            kpk,
            sindh,
            balochistan,
            party,
            totalVotes,
            timestamp
            };
        await ctx.stub.putState(party, Buffer.from(JSON.stringify(transaction)));
    }
    /**
     * 
     * @param {*} ctx 
     * @param {*} party 
     * @param {*} punjab 
     * @param {*} kpk 
     * @param {*} sindh 
     * @param {*} balochistan 
     * @param {*} totalVotes 
     * @param {*} timestamp 
     */
    async castedVotesByGender(ctx, genderId, male, female , timestamp) {
        const transaction = {
            genderId,
            docType: 'CastedVotesByGender',
            organization : 'PakVotingSystem',
            male,
            female,
            timestamp
            };
        await ctx.stub.putState(genderId, Buffer.from(JSON.stringify(transaction)));
    }
  /**
   * 
   * @param {*} ctx 
   * @param {*} ballotId 
   * @param {*} partyName 
   * @param {*} candidateName 
   * @param {*} totalVotes 
   * @param {*} timestamp 
   */
    async winnerByBallot(ctx, ballotId, partyName, candidateName, totalVotes, timestamp) {
        const transaction = {
            ballotId,
            docType: 'WinnerByBallot',
            organization : 'PakVotingSystem',
            partyName,
            candidateName,
            totalVotes,
            timestamp
            };
        await ctx.stub.putState(ballotId , Buffer.from(JSON.stringify(transaction)));
    }
    
    /**
     * 
     * @param {*} ctx 
     * @param {*} electionId 
     * @param {*} totalVotes 
     * @param {*} timestamp 
     */
    async totalVotes(ctx, electionId, totalVotes, timestamp) {
        const transaction = {
            electionId,
            docType: 'CastedVotes',
            organization : 'PakVotingSystem',
            totalVotes,
            timestamp
            };
        await ctx.stub.putState(electionId, Buffer.from(JSON.stringify(transaction)));
    }      
    /**
     * 
     * @param {*} ctx 
     * @param {*} party 
     * @returns 
     */

    // Query Vote Casted By Voter

    async queryvoteCastedByVoter(ctx, party){
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'VoteCastedByVoter';
        queryString.selector.party= party;
        return await this.getQueryResultForQueryString(ctx.stub ,JSON.stringify(queryString));
    }

    async getQueryResultForQueryString(stub, queryString){
        let resultsIterator = await stub.getQueryResult(queryString);
        let results = await this.getAllResults(resultsIterator, false);
        return  JSON.stringify(results);

    }
   
    async getAllResults(iterator , isHistory) {
        let allResults = [];
        while(true) {
            let res = await iterator.next();
            if(res.value && res.value.value.toString()){
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                  if (isHistory && isHistory=== true) {
                    jsonRes.ClimactID   = res.value.ClimactID;
                    jsonRes.GHGEmissionsFabricProduction  = res.value.GHGEmissionsFabricProduction;
                    jsonRes.GHGEmissionsMaterials  = res.value.GHGEmissionsMaterials;
                    jsonRes.GHGEmissionsTransportation = res.value.GHGEmissionsTransportation;
                    jsonRes.GHGEmissionsPackaging   = res.value.GHGEmissionsPackaging;
                    jsonRes.LightTouchCarbonFootprint   = res.value.LightTouchCarbonFootprint;
                    jsonRes.organizationId  = res.value.organizationId;
                    jsonRes.Timestamp = res.value.timestamp;
                  
                    try {
                        jsonRes.value = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch(err){
                        console.log(err);
                        jsonRes.value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.key = res.value.key;
                    try{
                        jsonRes.record =  JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch(err) {
                        console.log(err);
                        jsonRes.record = res.value.value.toString('utf8')
                    }
                }

                allResults.push(jsonRes);
            } 

            if (res.done){
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;

            }
        }
    } 
    
    /**
     * @param {*} ctx 
     * @param {*} id 
     * @returns 
     */

    /* Query All Winning Party By Province */

    async querywinningPartyByProvince(ctx, voterId){
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'WinningPartyByProvince';
        queryString.selector.voterId = voterId;
        return await this.getQueryResultForQueryString(ctx.stub ,JSON.stringify(queryString));
    }
    async getQueryResultForQueryString(stub, queryString){
        let resultsIterator = await stub.getQueryResult(queryString);
        let results = await this.getAllResults(resultsIterator, false);
        return  JSON.stringify(results);

    }

    async getAllResults(iterator , isHistory) {
        let allResults = [];
        while(true) {
            let res = await iterator.next();
            if(res.value && res.value.value.toString()){
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                  if (isHistory && isHistory=== true) {
                    jsonRes.Id   = res.value.id;
                    jsonRes.CO2Emissions  = res.value.cO2Emissions;
                    jsonRes.GHGEmissions  = res.value.ghgEmissions;
                    jsonRes.MaturityScore = res.value.maturityScore;
                    jsonRes.Timestamp = res.value.timestamp;
                  
                    try {
                        jsonRes.value = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch(err){
                        console.log(err);
                        jsonRes.value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.key = res.value.key;
                    try{
                        jsonRes.record =  JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch(err) {
                        console.log(err);
                        jsonRes.record = res.value.value.toString('utf8')
                    }
                }

                allResults.push(jsonRes);
            } 

            if (res.done){
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;

            }
        }
    } 
    
    /* Query Casted Votes By Gender */

    async querycastedVotesByGender(ctx, genderId){
        let queryString = {};
        queryString.selector = {};
        queryString.selector.docType = 'CastedVotesByGender';
        queryString.selector.genderId = genderId;
        return await this.getQueryResultForQueryString(ctx.stub ,JSON.stringify(queryString));
    }
    async getQueryResultForQueryString(stub, queryString){
        let resultsIterator = await stub.getQueryResult(queryString);
        let results = await this.getAllResults(resultsIterator, false);
        return  JSON.stringify(results);

    }
   
    async getAllResults(iterator , isHistory) {
        let allResults = [];
        while(true) {
            let res = await iterator.next();
            if(res.value && res.value.value.toString()){
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));
                  if (isHistory && isHistory=== true) {
                    jsonRes.ClimactID   = res.value.ClimactID;
                    jsonRes.GHGEmissionsFabricProduction  = res.value.GHGEmissionsFabricProduction;
                    jsonRes.GHGEmissionsMaterials  = res.value.GHGEmissionsMaterials;
                    jsonRes.GHGEmissionsTransportation = res.value.GHGEmissionsTransportation;
                    jsonRes.GHGEmissionsPackaging   = res.value.GHGEmissionsPackaging;
                    jsonRes.LightTouchCarbonFootprint   = res.value.LightTouchCarbonFootprint;
                    jsonRes.organizationId  = res.value.organizationId;
                    jsonRes.Timestamp = res.value.timestamp;
                  
                    try {
                        jsonRes.value = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch(err){
                        console.log(err);
                        jsonRes.value = res.value.value.toString('utf8');
                    }
                } else {
                    jsonRes.key = res.value.key;
                    try{
                        jsonRes.record =  JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch(err) {
                        console.log(err);
                        jsonRes.record = res.value.value.toString('utf8')
                    }
                }

                allResults.push(jsonRes);
            } 

            if (res.done){
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;

            }
        }
    } 

/* Query Winner By Ballot */

async querywinnerByBallot(ctx, ballotId){
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'WinnerByBallot';
    queryString.selector.ballotId = ballotId;
    return await this.getQueryResultForQueryString(ctx.stub ,JSON.stringify(queryString));
}
async getQueryResultForQueryString(stub, queryString){
    let resultsIterator = await stub.getQueryResult(queryString);
    let results = await this.getAllResults(resultsIterator, false);
    return  JSON.stringify(results);

}

async getAllResults(iterator , isHistory) {
    let allResults = [];
    while(true) {
        let res = await iterator.next();
        if(res.value && res.value.value.toString()){
            let jsonRes = {};
            console.log(res.value.value.toString('utf8'));
              if (isHistory && isHistory=== true) {
                jsonRes.ClimactID   = res.value.ClimactID;
                jsonRes.GHGEmissionsFabricProduction  = res.value.GHGEmissionsFabricProduction;
                jsonRes.GHGEmissionsMaterials  = res.value.GHGEmissionsMaterials;
                jsonRes.GHGEmissionsTransportation = res.value.GHGEmissionsTransportation;
                jsonRes.GHGEmissionsPackaging   = res.value.GHGEmissionsPackaging;
                jsonRes.LightTouchCarbonFootprint   = res.value.LightTouchCarbonFootprint;
                jsonRes.organizationId  = res.value.organizationId;
                jsonRes.Timestamp = res.value.timestamp;
              
                try {
                    jsonRes.value = JSON.parse(res.value.value.toString('utf8'));
                }
                catch(err){
                    console.log(err);
                    jsonRes.value = res.value.value.toString('utf8');
                }
            } else {
                jsonRes.key = res.value.key;
                try{
                    jsonRes.record =  JSON.parse(res.value.value.toString('utf8'));
                }
                catch(err) {
                    console.log(err);
                    jsonRes.record = res.value.value.toString('utf8')
                }
            }

            allResults.push(jsonRes);
        } 

        if (res.done){
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            return allResults;

        }
    }
} 



/* Query Total Votes */

async querytotalVotes(ctx, electionId){
    let queryString = {};
    queryString.selector = {};
    queryString.selector.docType = 'CastedVotes';
    queryString.selector.electionId = electionId;
    return await this.getQueryResultForQueryString(ctx.stub ,JSON.stringify(queryString));
}
async getQueryResultForQueryString(stub, queryString){
    let resultsIterator = await stub.getQueryResult(queryString);
    let results = await this.getAllResults(resultsIterator, false);
    return  JSON.stringify(results);

}

async getAllResults(iterator , isHistory) {
    let allResults = [];
    while(true) {
        let res = await iterator.next();
        if(res.value && res.value.value.toString()){
            let jsonRes = {};
            console.log(res.value.value.toString('utf8'));
              if (isHistory && isHistory=== true) {
                jsonRes.ClimactID   = res.value.ClimactID;
                jsonRes.GHGEmissionsFabricProduction  = res.value.GHGEmissionsFabricProduction;
                jsonRes.GHGEmissionsMaterials  = res.value.GHGEmissionsMaterials;
                jsonRes.GHGEmissionsTransportation = res.value.GHGEmissionsTransportation;
                jsonRes.GHGEmissionsPackaging   = res.value.GHGEmissionsPackaging;
                jsonRes.LightTouchCarbonFootprint   = res.value.LightTouchCarbonFootprint;
                jsonRes.organizationId  = res.value.organizationId;
                jsonRes.Timestamp = res.value.timestamp;
              
                try {
                    jsonRes.value = JSON.parse(res.value.value.toString('utf8'));
                }
                catch(err){
                    console.log(err);
                    jsonRes.value = res.value.value.toString('utf8');
                }
            } else {
                jsonRes.key = res.value.key;
                try{
                    jsonRes.record =  JSON.parse(res.value.value.toString('utf8'));
                }
                catch(err) {
                    console.log(err);
                    jsonRes.record = res.value.value.toString('utf8')
                }
            }

            allResults.push(jsonRes);
        } 

        if (res.done){
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            return allResults;

        }
    }
} 



    /* Query Assets. */
      async queryAssets(ctx) {
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await(const {key, value}
        of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({Key: key, Record: record});
        }
    
    console.info(allResults);
    return JSON.stringify(allResults);
   
    }
}

module.exports = Transaction;
