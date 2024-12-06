/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

// Deterministic JSON.stringify()
const stringify  = require('json-stringify-deterministic');
const sortKeysRecursive  = require('sort-keys-recursive');
const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
        const assets = [
            {
                ID: 'asset1',
                Color: 'blue',
                Size: 5,
                Owner: 'Tomoko',
                AppraisedValue: 300,
            },
            {
                ID: 'asset2',
                Color: 'red',
                Size: 5,
                Owner: 'Brad',
                AppraisedValue: 400,
            },
            {
                ID: 'asset3',
                Color: 'green',
                Size: 10,
                Owner: 'Jin Soo',
                AppraisedValue: 500,
            },
            {
                ID: 'asset4',
                Color: 'yellow',
                Size: 10,
                Owner: 'Max',
                AppraisedValue: 600,
            },
            {
                ID: 'asset5',
                Color: 'black',
                Size: 15,
                Owner: 'Adriana',
                AppraisedValue: 700,
            },
            {
                ID: 'asset6',
                Color: 'white',
                Size: 15,
                Owner: 'Michel',
                AppraisedValue: 800,
            },
        ];

        for (const asset of assets) {
            asset.docType = 'asset';
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(asset.ID, Buffer.from(stringify(sortKeysRecursive(asset))));
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    async CreateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (exists) {
            throw new Error(`The asset ${id} already exists`);
        }

        const asset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return JSON.stringify(asset);
    }

    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, id, color, size, owner, appraisedValue) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }

        // overwriting original asset with new asset
        const updatedAsset = {
            ID: id,
            Color: color,
            Size: size,
            Owner: owner,
            AppraisedValue: appraisedValue,
        };
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(updatedAsset))));
    }

    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx, id) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state.
    async TransferAsset(ctx, id, newOwner) {
        const assetString = await this.ReadAsset(ctx, id);
        const asset = JSON.parse(assetString);
        const oldOwner = asset.Owner;
        asset.Owner = newOwner;
        // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
        await ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
        return oldOwner;
    }

    // GetAllAssets returns all assets found in the world state.
    async GetAllAssets(ctx) {
        const allResults = [];
        // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push(record);
            result = await iterator.next();
        }
        return JSON.stringify(allResults);
    }

    async createElection(ctx, electionId, startTime, endTime, candidates) {
        // Validate input
        if (!electionId || !startTime || !endTime || !candidates || candidates.length === 0) {
            throw new Error('Invalid election parameters');
        }

        // Check if election already exists
        const electionKey = ctx.stub.createCompositeKey('election', [electionId]);
        const existingElection = await ctx.stub.getState(electionKey);
        if (existingElection && existingElection.length > 0) {
            throw new Error(`Election ${electionId} already exists`);
        }

        // Create election object
        const election = {
            electionId,
            startTime: parseInt(startTime),
            endTime: parseInt(endTime),
            candidates: JSON.parse(candidates),
            status: 'CREATED',
            docType: 'election'
        };

        // Store election details
        await ctx.stub.putState(electionKey, Buffer.from(JSON.stringify(election)));

        // Initialize vote counts for candidates
        for (let candidate of election.candidates) {
            const countKey = ctx.stub.createCompositeKey('count', [electionId, candidate]);
            await ctx.stub.putState(countKey, Buffer.from('0'));
        }

        return JSON.stringify(election);
    }

    async castVote(ctx, electionId, voterId, candidateId, timestamp) {
        console.info('============= START : Cast Vote ===========');
        
        // Validate input
        if (!electionId || !voterId || !candidateId || !timestamp) {
            throw new Error('Missing required vote parameters');
        }

        // Retrieve election details
        const electionKey = ctx.stub.createCompositeKey('election', [electionId]);
        const electionBytes = await ctx.stub.getState(electionKey);
        if (!electionBytes || electionBytes.length === 0) {
            throw new Error(`Election ${electionId} does not exist`);
        }

        const election = JSON.parse(electionBytes.toString());
        const currentTime = parseInt(timestamp);

        // Validate election status and timing
        if (election.status !== 'CREATED' && election.status !== 'ONGOING') {
            throw new Error(`Election ${electionId} is not in a valid voting state`);
        }
        if (currentTime < election.startTime || currentTime > election.endTime) {
            throw new Error(`Voting for election ${electionId} is not currently open`);
        }

        // Validate candidate
        if (!election.candidates.includes(candidateId)) {
            throw new Error(`Invalid candidate ${candidateId} for election ${electionId}`);
        }

        // Check if voter has already voted in this election
        const voterVoteKey = ctx.stub.createCompositeKey('vote', [electionId, voterId]);
        const existingVote = await ctx.stub.getState(voterVoteKey);
        if (existingVote && existingVote.length > 0) {
            throw new Error(`Voter ${voterId} has already cast a vote in election ${electionId}`);
        }

        // Create vote object
        const vote = {
            electionId,
            voterId,
            candidateId,
            timestamp: currentTime,
            docType: 'vote'
        };

        // Store vote
        await ctx.stub.putState(voterVoteKey, Buffer.from(JSON.stringify(vote)));

        // Update vote count for candidate
        const countKey = ctx.stub.createCompositeKey('count', [electionId, candidateId]);
        const countBytes = await ctx.stub.getState(countKey);
        const count = countBytes ? parseInt(countBytes.toString()) + 1 : 1;
        await ctx.stub.putState(countKey, Buffer.from(count.toString()));

        console.info('============= END : Cast Vote ===========');
        return JSON.stringify(vote);
    }

    async getElectionResults(ctx, electionId) {
        // Retrieve election details
        const electionKey = ctx.stub.createCompositeKey('election', [electionId]);
        const electionBytes = await ctx.stub.getState(electionKey);
        if (!electionBytes || electionBytes.length === 0) {
            throw new Error(`Election ${electionId} does not exist`);
        }

        const election = JSON.parse(electionBytes.toString());
        const results = [];

        // Fetch vote counts for each candidate
        for (let candidate of election.candidates) {
            const countKey = ctx.stub.createCompositeKey('count', [electionId, candidate]);
            const countBytes = await ctx.stub.getState(countKey);
            const voteCount = countBytes ? parseInt(countBytes.toString()) : 0;
            
            results.push({
                candidateId: candidate,
                voteCount: voteCount
            });
        }

        return JSON.stringify(results);
    }

    async updateElectionStatus(ctx, electionId, newStatus) {
        // Validate input
        const validStatuses = ['CREATED', 'ONGOING', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(newStatus)) {
            throw new Error('Invalid election status');
        }

        // Retrieve and update election
        const electionKey = ctx.stub.createCompositeKey('election', [electionId]);
        const electionBytes = await ctx.stub.getState(electionKey);
        if (!electionBytes || electionBytes.length === 0) {
            throw new Error(`Election ${electionId} does not exist`);
        }

        const election = JSON.parse(electionBytes.toString());
        election.status = newStatus;

        // Store updated election
        await ctx.stub.putState(electionKey, Buffer.from(JSON.stringify(election)));

        return JSON.stringify(election);
    }
}

module.exports = AssetTransfer;
