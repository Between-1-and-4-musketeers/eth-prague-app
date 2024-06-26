#[macro_use]
extern crate ic_cdk_macros;
#[macro_use]
extern crate serde;

use candid::CandidType;
use ic_cdk::api::call::RejectionCode;

#[update]
fn create() -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    // return match conn.execute("DROP TABLE Spaces", [])
    return match conn.execute_batch(
       "
       pragma foreign_keys = ON;
        BEGIN TRANSACTION;

       CREATE TABLE Admins (
           Address TEXT NOT NULL CONSTRAINT PK_Admins PRIMARY KEY
       );
       
       CREATE TABLE BtcStrategies (
           Id INTEGER NOT NULL CONSTRAINT PK_BtcStrategies PRIMARY KEY AUTOINCREMENT,
           RuneId TEXT NOT NULL
       );
       
       CREATE TABLE EvmStrategies (
           Id INTEGER NOT NULL CONSTRAINT PK_EvmStrategies PRIMARY KEY AUTOINCREMENT,
           ChainId INTEGER NOT NULL,
           ContractAddress TEXT NOT NULL,
           ConfigString TEXT NOT NULL
       );
       
       CREATE TABLE Spaces (
           Id INTEGER NOT NULL CONSTRAINT PK_Spaces PRIMARY KEY AUTOINCREMENT,
           Name TEXT NOT NULL,
           WebsiteLink TEXT NULL,
           IconLink TEXT NULL,
           VoteDelay INTEGER NOT NULL,
           VoteDuration INTEGER NOT NULL,
           Quorum INTEGER NOT NULL,
           MinVoteRole INTEGER NOT NULL,
           MinVotePower INTEGER NOT NULL
       );
       
       CREATE TABLE AdminSpaces (
           AdminID TEXT NOT NULL,
           SpaceID INTEGER NOT NULL,
           CONSTRAINT PK_AdminSpaces PRIMARY KEY (AdminID, SpaceID),
           CONSTRAINT FK_AdminSpaces_Admins_AdminID FOREIGN KEY (AdminID) REFERENCES Admins (Address) ON DELETE CASCADE,
           CONSTRAINT FK_AdminSpaces_Spaces_SpaceID FOREIGN KEY (SpaceID) REFERENCES Spaces (Id) ON DELETE CASCADE
       );
       
       CREATE TABLE Proposals (
           Id INTEGER NOT NULL CONSTRAINT PK_Proposals PRIMARY KEY AUTOINCREMENT,
           Title TEXT NOT NULL,
           Description TEXT NOT NULL,
           Mechanism INTEGER NOT NULL,
           DateCreated INTEGER NOT NULL,
           SpaceId INTEGER NOT NULL,
           CONSTRAINT FK_Proposals_Spaces_SpaceId FOREIGN KEY (SpaceId) REFERENCES Spaces (Id) ON DELETE CASCADE
       );
       
       CREATE TABLE Strategies (
           Id INTEGER NOT NULL CONSTRAINT PK_Strategies PRIMARY KEY AUTOINCREMENT,
           Name TEXT NOT NULL,
           SpaceId INTEGER NOT NULL,
           Description TEXT NULL,
           BtcId INTEGER NULL,
           EvmId INTEGER NULL,
           CONSTRAINT FK_Strategies_BtcStrategies_BtcId FOREIGN KEY (BtcId) REFERENCES BtcStrategies (Id) ON DELETE CASCADE,
           CONSTRAINT FK_Strategies_EvmStrategies_EvmId FOREIGN KEY (EvmId) REFERENCES EvmStrategies (Id) ON DELETE CASCADE,
           CONSTRAINT FK_Strategies_Spaces_SpaceId FOREIGN KEY (SpaceId) REFERENCES Spaces (Id) ON DELETE CASCADE
       );
       
       CREATE TABLE ProposalOptions
       (
           Id         INTEGER NOT NULL
               CONSTRAINT PK_ProposalOptions PRIMARY KEY AUTOINCREMENT,
           Name       TEXT    NOT NULL,
           onWinContractAddress TEXT NOT NULL,
           onWinBytecode TEXT NOT NULL,
           onWinChainId INTEGER NOT NULL,
           ProposalId INTEGER NOT NULL,
           CONSTRAINT FK_ProposalOptions_Proposals_ProposalId FOREIGN KEY (ProposalId) REFERENCES Proposals (Id) ON DELETE CASCADE
       );
       
       CREATE TABLE ProposalOptionVotes
       (
           Id          INTEGER NOT NULL
               CONSTRAINT PK_ProposalOptionVotes PRIMARY KEY AUTOINCREMENT,
           UserAddress TEXT    NOT NULL,
           type        INTEGER NOT NULL,
           timestamp   INTEGER NOT NULL,
           signature   TEXT    NOT NULL,
           VotingPower INTEGER NOT NULL,
           OptionId    INTEGER NOT NULL,
           CONSTRAINT FK_ProposalOptionVotes_ProposalOptions_OptionId FOREIGN KEY (OptionId) REFERENCES ProposalOptions (Id) ON DELETE CASCADE,
           CONSTRAINT Unique_Vote UNIQUE(OptionId,UserAddress)
       );

       CREATE TABLE ProposalBlocks(
        Id INTEGER NOT NULL CONSTRAINT PK_Proposals PRIMARY KEY AUTOINCREMENT,
        Type INTEGER NOT NULL,
        ChainId INTEGER NULL,
        BlockNumber INTEGER NOT NULL,
        ProposalID INTEGER NOT NULL,
        CONSTRAINT FK_ProposalBlocks_Proposals_BtcId FOREIGN KEY (ProposalID) REFERENCES Proposals (Id) ON DELETE CASCADE
        );


        CREATE TABLE SpaceEvents(
            Id            INTEGER NOT NULL CONSTRAINT PK_SpaceEvents PRIMARY KEY AUTOINCREMENT,
            EventType     INTEGER NOT NULL,
            WebhookURL    TEXT NOT NULL,
            Payload       TEXT NOT NULL,
            SpaceID       INTEGER NOT NULL,
            CONSTRAINT FK_SpaceEvents_Spaces_SpaceID FOREIGN KEY (SpaceID) REFERENCES Spaces (Id) ON DELETE CASCADE
        );
       
       CREATE INDEX IX_AdminSpaces_SpaceID ON AdminSpaces (SpaceID);
       
       CREATE INDEX IX_ProposalOptions_ProposalId ON ProposalOptions (ProposalId);
       
       CREATE INDEX IX_ProposalOptionVotes_OptionId ON ProposalOptionVotes (OptionId);
       
       CREATE INDEX IX_Proposals_SpaceId ON Proposals (SpaceId);
       
       CREATE UNIQUE INDEX IX_Strategies_BtcId ON Strategies (BtcId);
       
       CREATE UNIQUE INDEX IX_Strategies_EvmId ON Strategies (EvmId);
       
       CREATE INDEX IX_Strategies_SpaceId ON Strategies (SpaceId);

       CREATE INDEX IX_ProposalBlocks_ProposalId ON ProposalBlocks (ProposalID);
       
       CREATE INDEX IX_SpaceEvents_SpaceId ON SpaceEvents (SpaceID);

       END TRANSACTION;"
    )
    {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => {
            let _ = conn.execute("ROLLBACK;", []);
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            });
        }
    };
}


#[update]
fn seed_data() -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    // return match conn.execute("DROP TABLE Spaces", [])
    return match conn.execute_batch(
       "
       BEGIN TRANSACTION;
        insert into Spaces(id,name, iconlink, websitelink, minvoterole, minvotepower, votedelay, voteduration, quorum)
            values (1,'FrajerCZ','https://pbs.twimg.com/profile_images/1528083447973138432/mzJJ6iaf_400x400.jpg',
                    'https://x.com/ReformedRamsay',0,0,100000,10000,100);
        insert into Spaces(id,name, iconlink, websitelink, minvoterole, minvotepower, votedelay, voteduration, quorum)
            values (2,'Sushi','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIwIAmAKD59SQKJIe3wA_s_OQXLqmYYZAO0Q&s',
                    'sushi.com',2,2,2,2,2);

        insert into EvmStrategies(chainid, contractaddress, configstring)
        values (1,'0x6B3595068778DD592e39A122f4f5a5cF09C90fE2','0x70a08231000000000000000000000000$voterAddress');

        INSERT INTO Strategies(Id,Name, SpaceId, EvmId)
        VALUES (1,'sushak', 1,
                (SELECT seq FROM SQLITE_SEQUENCE WHERE name = 'EvmStrategies'));


        insert into SpaceEvents(Id,eventtype, webhookurl, payload, spaceid)
        values (1,
                0,
                'https://discord.com/api/webhooks/1246613644213751828/AtvEBGU7OPtQ97jAM-ZW7A_GBCiy-sGu5bpHJSSFrLnxjSuqFckec0_VjPfj85u7ByA_',
                '{ \"content\": \"Ahoj!\\nPepa s adresou ${voterAddress} prave votoval se silou ${power} CO DOPICE?! s😁😁\", \"embeds\": null, \"attachments\": [] }',
                1);

        insert into Proposals(id,title, description, mechanism, datecreated, spaceid)
        values(2,'jo ?','pls vote',2,2,2);

        insert into Proposals(id,title, description, mechanism, datecreated, spaceid)
        values(1,'jit spat','chrr pspps lufi spi!',0,1717286697,1);

        insert into ProposalOptions(id,name, proposalid)
        values (3,'a',2);
        insert into ProposalOptions(id,name, proposalid)
        values (4,'b',2);
        insert into ProposalOptions(id,name, proposalid)
        values (5,'c',2);

        insert into ProposalOptions(id,name,proposalid)
        values (1,'Ano',1);
        insert into ProposalOptions(id,name,proposalid)
        values (2,'Ne',1);

        insert into ProposalOptionVotes(id,UserAddress,type,timestamp,signature,VotingPower,OptionId)
        values (1,'ahoj',1,2,'a',2,1);
        insert into ProposalOptionVotes(id,UserAddress,type,timestamp,signature,VotingPower,OptionId)
        values (2,'0xdc84b5f5957290e27daf8c0976d77b5af45baaaa',0,1717287836,'0x72085ce618d2a7641a65ea2331b29b18c3c662eb450a20abf4221c952eeee1fe00e3c7867ec6e93bcd1234b3941e53e3ddfcba9e2ed676b9bdd5064eebaee32b1c',3,2);
        COMMIT;"
    )
    {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => {
            let _ = conn.execute("ROLLBACK;", []);
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            });
        }
    };
}


#[update]
fn drop() -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute_batch(
        "
        PRAGMA writable_schema = 1;

        delete from sqlite_master where type in ('table', 'index', 'trigger');
    
        PRAGMA writable_schema = 0;
        VACUUM;
    ",
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => {
            let _ = conn.execute("ROLLBACK;", []);
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            });
        }
    };
}

#[update]
fn alter() -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute_batch(
        "
        alter table ProposalOptions add column onWinContractAddress TEXT NOT NULL default '';
        alter table ProposalOptions add column onWinBytecode TEXT NOT NULL default '';
        alter table ProposalOptions add column onWinChainId INTEGER NOT NULL default 0;
    ",
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => {
            let _ = conn.execute("ROLLBACK;", []);
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            });
        }
    };
}

#[query]
fn query_all_spaces(params: QueryParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare("select * from Spaces limit ?1 offset ?2") {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let spaces_iter = match stmt.query_map((params.limit, params.offset), |row| {
        Ok(Space {
            id: row.get(0).unwrap(),
            name: row.get(1).unwrap(),
            websiteLink: row.get(2).unwrap(),
            iconLink: row.get(3).unwrap(),
            voteDelay: row.get(4).unwrap(),
            voteDuration: row.get(5).unwrap(),
            quorum: row.get(6).unwrap(),
            minVoteRole: row.get(7).unwrap(),
            minVotePower: row.get(8).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut spaces = Vec::new();
    for space in spaces_iter {
        spaces.push(space.unwrap());
    }

    let res = serde_json::to_string(&spaces).unwrap();
    if res == "null" {
        return Ok("[]".to_string());
    }
    Ok(res)
}

#[query]
fn query_spaces_by_id(params: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare("select * from Spaces where id = ?1 limit 1") {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };

    let spaces_iter = match stmt.query_map([params.id], |row| {
        Ok(Space {
            id: row.get(0).unwrap(),
            name: row.get(1).unwrap(),
            websiteLink: row.get(2).unwrap(),
            iconLink: row.get(3).unwrap(),
            voteDelay: row.get(4).unwrap(),
            voteDuration: row.get(5).unwrap(),
            quorum: row.get(6).unwrap(),
            minVoteRole: row.get(7).unwrap(),
            minVotePower: row.get(8).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut spaces = Vec::new();
    for space in spaces_iter {
        spaces.push(space.unwrap());
    }
    let res = serde_json::to_string(&spaces.first()).unwrap();
    if res == "null" {
        return Ok("[]".to_string());
    }
    Ok(res)
}

#[query]
fn query_proposal_by_id(params: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare("select * from Proposals where id = ?1 limit 1") {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };

    let proposals_iter = match stmt.query_map([params.id], |row| {
        Ok(Proposal {
            id: row.get(0).unwrap(),
            title: row.get(1).unwrap(),
            description: row.get(2).unwrap(),
            mechanism: row.get(3).unwrap(),
            dateCreated: row.get(4).unwrap(),
            spaceId: row.get(5).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut proposals = Vec::new();
    for proposal in proposals_iter {
        proposals.push(proposal.unwrap());
    }
    let res = serde_json::to_string(&proposals.first()).unwrap();
    if res == "null" {
        return Ok("[]".to_string());
    }
    Ok(res)
}

#[query]
fn query_proposals_by_space_id(params: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt =
        match conn.prepare("Select * from Proposals where Proposals.SpaceId = ?1 limit 1") {
            Ok(e) => e,
            Err(err) => {
                return Err(Error::CanisterError {
                    message: format!("{:?}", err),
                })
            }
        };

    let proposals_iter = match stmt.query_map([params.id], |row| {
        Ok(Proposal {
            id: row.get(0).unwrap(),
            title: row.get(1).unwrap(),
            description: row.get(2).unwrap(),
            mechanism: row.get(3).unwrap(),
            dateCreated: row.get(4).unwrap(),
            spaceId: row.get(5).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut proposals = Vec::new();
    for proposal in proposals_iter {
        proposals.push(proposal.unwrap());
    }
    let res = serde_json::to_string(&proposals).unwrap();
    if res == "null" {
        return Ok("[]".to_string());
    }
    Ok(res)
}

#[query]
fn get_proposals_with_voting_power_by_proposal_id(params: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(
        "
        SELECT o.Id, o.Name, IFNULL(sum(ALL v.VotingPower), 0) AS votingSum
        FROM ProposalOptions o
                 left join ProposalOptionVotes v on o.Id = v.OptionId
        WHERE (o.ProposalId = ?1)
        GROUP BY o.Id, o.Name;
    ",
    ) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let proposals_iter = match stmt.query_map([params.id], |row| {
        Ok(GetProposalVotingPower {
            id: row.get(0).unwrap(),
            name: row.get(1).unwrap(),
            power: row.get(2).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut proposals = Vec::new();
    for proposal in proposals_iter {
        proposals.push(proposal.unwrap());
    }
    let res = serde_json::to_string(&proposals).unwrap();
    Ok(res)
}

#[query]
fn get_proposal_option_by_user_adress_and_proposal_id(params: GetByAdressAndId) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(
        "
        SELECT POV.Id, POV.UserAddress, POV.type, POV.timestamp, POV.signature, POV.VotingPower, POV.OptionId FROM
        ProposalOptionVotes POV join ProposalOptions PO on POV.OptionId = PO.Id join Proposals P on PO.ProposalId = P.Id
        WHERE P.Id = ?1 AND POV.UserAddress = ?2
    ",
    ) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let proposals_iter = match stmt.query_map((params.id, params.address), |row| {
        Ok(ProposalOptionVote {
            id: row.get(0).unwrap(),
            userAddress: row.get(1).unwrap(),
            voteType: row.get(2).unwrap(),
            timestamp: row.get(3).unwrap(),
            signature: row.get(4).unwrap(),
            votingPower: row.get(5).unwrap(),
            optionId: row.get(6).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut proposals = Vec::new();
    for proposal in proposals_iter {
        proposals.push(proposal.unwrap());
    }
    let res = serde_json::to_string(&proposals.first()).unwrap();
    Ok(res)
}

#[query]
fn get_proposal_votes_by_proposal_id(params: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(
        "
        SELECT POV.Id, POV.UserAddress, POV.type, POV.timestamp, POV.signature, POV.VotingPower, POV.OptionId FROM
        ProposalOptionVotes POV join ProposalOptions PO on POV.OptionId = PO.Id join Proposals P on PO.ProposalId = P.Id
        WHERE P.Id = ?1
    ",
    ) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let proposals_iter = match stmt.query_map([params.id], |row| {
        Ok(ProposalOptionVote {
            id: row.get(0).unwrap(),
            userAddress: row.get(1).unwrap(),
            voteType: row.get(2).unwrap(),
            timestamp: row.get(3).unwrap(),
            signature: row.get(4).unwrap(),
            votingPower: row.get(5).unwrap(),
            optionId: row.get(6).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut proposals = Vec::new();
    for proposal in proposals_iter {
        proposals.push(proposal.unwrap());
    }
    let res = serde_json::to_string(&proposals).unwrap();
    Ok(res)
}

#[query]
fn get_proposal_options_by_proposal_id(params: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(
        "
        select id, name, proposalid, onWinContractAddress, onWinBytecode, onWinChainId from ProposalOptions where proposalid = ?1;
    ",
    ) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let proposals_iter = match stmt.query_map([params.id], |row| {
        Ok(ProposalOption {
            id: row.get(0).unwrap(),
            name: row.get(1).unwrap(),
            proposalId: row.get(2).unwrap(),
            onWinContractAddress: row.get(3).unwrap(),
            onWinBytecode: row.get(4).unwrap(),
            onWinChainId: row.get(5).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut proposals = Vec::new();
    for proposal in proposals_iter {
        proposals.push(proposal.unwrap());
    }
    let res = serde_json::to_string(&proposals).unwrap();
    Ok(res)
}

#[query]
fn get_all_btc_strategies_by_space_id(params: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(
        "
        SELECT Strategies.Id, name, Strategies.description, spaceid,runeid
FROM Strategies
         LEFT JOIN BtcStrategies BS on BS.Id = Strategies.BtcId where Strategies.SpaceId = ?1 and BtcId is not null;
    ",
    ) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let strategies_iter = match stmt.query_map([params.id], |row| {
        Ok(GetBtcStrategy {
            id: row.get(0).unwrap(),
            name: row.get(1).unwrap(),
            description: row.get(2).unwrap(),
            spaceId: row.get(2).unwrap(),
            runeId: row.get(3).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut strategies = Vec::new();
    for strategy in strategies_iter {
        strategies.push(strategy.unwrap());
    }
    let res = serde_json::to_string(&strategies).unwrap();
    Ok(res)
}

#[query]
fn get_all_evm_strategies_by_space_id(params: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(
        "
        SELECT Strategies.Id, name , Strategies.description, spaceid,ChainId,ContractAddress,ConfigString
        FROM Strategies
                 LEFT JOIN EvmStrategies EVM on EVM.Id = Strategies.EvmId where Strategies.SpaceId = ?1 and EvmId is not null;
    ",
    ) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let strategies_iter = match stmt.query_map([params.id], |row| {
        Ok(GetEvmStrategy {
            id: row.get(0).unwrap(),
            name: row.get(1).unwrap(),
            description: row.get(2).unwrap(),
            spaceId: row.get(3).unwrap(),
            chainId: row.get(4).unwrap(),
            contractAddress: row.get(5).unwrap(),
            configString: row.get(6).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut strategies = Vec::new();
    for strategy in strategies_iter {
        strategies.push(strategy.unwrap());
    }
    let res = serde_json::to_string(&strategies).unwrap();
    Ok(res)
}

#[query]
fn get_all_space_events_by_space_id(params: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(
        "
        select id, eventtype, webhookurl, payload, spaceid from SpaceEvents where SpaceID = ?1;

    ",
    ) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let strategies_iter = match stmt.query_map([params.id], |row| {
        Ok(SpaceEvent {
            id: row.get(0).unwrap(),
            eventtype: row.get(1).unwrap(),
            webhookUrl: row.get(2).unwrap(),
            payload: row.get(3).unwrap(),
            spaceId: row.get(4).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut strategies = Vec::new();
    for strategy in strategies_iter {
        strategies.push(strategy.unwrap());
    }
    let res = serde_json::to_string(&strategies).unwrap();
    Ok(res)
}
#[query]

fn get_all_space_events() -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let mut stmt = match conn.prepare(
        "
        select id, eventtype, webhookurl, payload, spaceid from SpaceEvents;

    ",
    ) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let strategies_iter = match stmt.query_map([], |row| {
        Ok(SpaceEvent {
            id: row.get(0).unwrap(),
            eventtype: row.get(1).unwrap(),
            webhookUrl: row.get(2).unwrap(),
            payload: row.get(3).unwrap(),
            spaceId: row.get(4).unwrap(),
        })
    }) {
        Ok(e) => e,
        Err(err) => {
            return Err(Error::CanisterError {
                message: format!("{:?}", err),
            })
        }
    };
    let mut strategies = Vec::new();
    for strategy in strategies_iter {
        strategies.push(strategy.unwrap());
    }
    let res = serde_json::to_string(&strategies).unwrap();
    Ok(res)
}

// #[query]
// fn query_filter(params: FilterParams) -> Result {
//     let conn = ic_sqlite::CONN.lock().unwrap();
//     let mut stmt = match conn.prepare("select * from person where name=?1") {
//         Ok(e) => e,
//         Err(err) => return Err(Error::CanisterError {message: format!("{:?}", err) })
//     };
//     let person_iter = match stmt.query_map((params.name, ), |row| {
//         Ok(PersonQuery {
//             id: row.get(0).unwrap(),
//             name: row.get(1).unwrap(),
//             age: row.get(2).unwrap(),
//         })
//     }) {
//         Ok(e) => e,
//         Err(err) => return Err(Error::CanisterError {message: format!("{:?}", err) })
//     };
//     let mut persons = Vec::new();
//     for person in person_iter {
//         persons.push(person.unwrap());
//     }
//     let res = serde_json::to_string(&persons).unwrap();
//     Ok(res)
// }

#[update]
fn insert_space(spaces: Space) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    if spaces.id != 0 {
        return match conn.execute(
            "UPDATE Spaces set name=?2,
            websitelink=?3,
            iconlink=?4,
            minvoterole=?5,
            minvotepower=?6,
            votedelay=?7,
            voteduration=?8,
            quorum=?9
        where Id = ?1;",
            (
                spaces.id,
                spaces.name,
                spaces.websiteLink,
                spaces.iconLink,
                spaces.voteDelay,
                spaces.voteDuration,
                spaces.quorum,
                spaces.minVoteRole,
                spaces.minVotePower,
            ),
        ) {
            Ok(e) => Ok(format!("{:?}", e)),
            Err(err) => Err(Error::CanisterError {
                message: format!("{:?}", err),
            }),
        };
    }
    return match conn.execute(
        "insert into Spaces (
            Name,
            WebsiteLink,
            IconLink,
            VoteDelay,
            VoteDuration,
            Quorum,
            MinVoteRole,
            MinVotePower
        ) values (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8);",
        (
            spaces.name,
            spaces.websiteLink,
            spaces.iconLink,
            spaces.voteDelay,
            spaces.voteDuration,
            spaces.quorum,
            spaces.minVoteRole,
            spaces.minVotePower,
        ),
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

#[update]
fn insert_btc_strategy(insertBtc: InsertBtcStrategy) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let res1 = conn.execute("BEGIN TRANSACTION;", []);
    let res2 = conn.execute(
        "insert into BtcStrategies(RuneId) values (?1);",
        [insertBtc.runeId],
    );
    let res3 = conn.execute(
        "insert into Strategies(Name,Description, SpaceId,BtcId,EvmId)
        values (?1,?2 ,last_insert_rowid(),null);",
        (insertBtc.name, insertBtc.description, insertBtc.spaceId),
    );
    let res4 = conn.execute(
        "
        END TRANSACTION;
        ",
        (),
    );

    let pole = [res1, res2, res3, res4];

    for i in pole.iter() {
        match i {
            Ok(e) => continue,
            Err(err) => {
                let _ = conn.execute("ROLLBACK;", []);
                return Err(Error::CanisterError {
                    message: format!("{:?}", err),
                });
            }
        };
    }

    return Ok(format!("{:?}", "OK"));
}

#[update]
fn insert_evm_strategy(insertEvm: InsertEvmStrategy) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    if insertEvm.id == 0 {
        let res1 = conn.execute("BEGIN TRANSACTION;", []);
        let res2 = conn.execute(
            "insert into EvmStrategies(ChainId,ContractAddress,ConfigString) values (?1,?2,?3);",
            (
                insertEvm.chainId,
                insertEvm.contractAddress,
                insertEvm.configString,
            ),
        );
        let res3 = conn.execute(
            " insert into Strategies(Name,Description, SpaceId,EvmId)
        values (?1,?2,?3, last_insert_rowid());",
            (insertEvm.name, insertEvm.description, insertEvm.spaceId),
        );
        let res4 = conn.execute(
            "
        END TRANSACTION;
        ",
            (),
        );

        let pole = [res1, res2, res3, res4];

        for i in pole.iter() {
            match i {
                Ok(e) => continue,
                Err(err) => {
                    let _ = conn.execute("ROLLBACK;", []);
                    return Err(Error::CanisterError {
                        message: format!("{:?}", err),
                    });
                }
            };
        }

        return Ok(format!("{:?}", "OK"));
    }
    else{
        let res1 = conn.execute("BEGIN TRANSACTION;", []);
        let res2 = conn.execute(
            "Update EvmStrategies SET ChainId=?2, ContractAddress=?3,ConfigString=?4 where (select EvmId from Strategies where Id=?1);",
            (
                insertEvm.id,
                insertEvm.chainId,
                insertEvm.contractAddress,
                insertEvm.configString,
            ),
        );
        let res3 = conn.execute(
            "UPDATE Strategies SET Name=?2,Description=?3,spaceId=?4 WHERE Id = ?1;",
            (insertEvm.id,insertEvm.name, insertEvm.description, insertEvm.spaceId),
        );
        let res4 = conn.execute(
            "
        END TRANSACTION;
        ",
            (),
        );

        let pole = [res1, res2, res3, res4];

        for i in pole.iter() {
            match i {
                Ok(e) => continue,
                Err(err) => {
                    let _ = conn.execute("ROLLBACK;", []);
                    return Err(Error::CanisterError {
                        message: format!("{:?}", err),
                    });
                }
            };
        }

        return Ok(format!("{:?}", "OK"));
    }
}

#[update]
fn insert_proposal(insertProposal: InsertProposal) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    let res1 = conn.execute("BEGIN TRANSACTION;", []);
    let res2 = conn.execute(
        "insert into Proposals (Title, Description, Mechanism, DateCreated, SpaceId)
        VALUES (?1, ?2, ?3, ?4, ?5);",
        (
            insertProposal.title,
            insertProposal.description,
            insertProposal.mechanism,
            insertProposal.dateCreated,
            insertProposal.spaceId,
        ),
    );

    let res4 = conn.execute(
        "
        COMMIT;
        ",
        (),
    );

    let pole = [res1, res2, res4];

    for i in pole.iter() {
        match i {
            Ok(e) => continue,
            Err(err) => {
                let _ = conn.execute("ROLLBACK;", []);
                return Err(Error::CanisterError {
                    message: format!("{:?}", err),
                });
            }
        };
    }

    return Ok(format!("{:?}", "OK"));
}

#[update]
fn insert_proposal_option_vote(vote: InsertProposalOptionVote) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute(
        "insert into ProposalOptionVotes(useraddress, type, timestamp, signature, votingpower, optionid)
        values (?1, ?2, ?3, ?4, ?5, ?6);",
        (
          vote.userAddress, vote.voteType, vote.timestamp, vote.signature, vote.votingPower, vote.optionId
        ),
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}



#[update]
fn insert_proposal_option(option: InsertProposalOption) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute(
        "insert into ProposalOptions(name, proposalid, onWinContractAddress, onWinBytecode, onWinChainId) values (?1, ?2, ?3, ?4, ?5);",
        (
            option.name,
            option.proposalId,
            option.onWinContractAddress,
            option.onWinBytecode,
            option.onWinChainId,
        ),
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

#[update]
fn insert_proposal_block(block: InsertProposalBlock) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute(
        "insert into ProposalBlocks(type, chainid, blocknumber, ProposalID)
        values (?1, ?2, ?3, ?4);",
        (
            block.voteType,
            block.chainId,
            block.blocknumber,
            block.proposalID,
        ),
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

#[update]
fn insert_space_event(spaceEvents: SpaceEvent) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    if spaceEvents.id != 0 {
        return match conn.execute(
            "UPDATE SpaceEvents set
            eventtype = ?2,
            webhookurl = ?3,
            payload = ?4,
            spaceId = ?5
        where Id = ?1;",
            (
                spaceEvents.id,
                spaceEvents.eventtype,
                spaceEvents.webhookUrl,
                spaceEvents.payload,
                spaceEvents.spaceId,
            ),
        ) {
            Ok(e) => Ok(format!("{:?}", e)),
            Err(err) => Err(Error::CanisterError {
                message: format!("{:?}", err),
            }),
        };
    }
    return match conn.execute(
        "insert into SpaceEvents(eventtype, webhookurl, payload, spaceid) values(?1,?2,?3,?4);",
        (
            spaceEvents.eventtype,
            spaceEvents.webhookUrl,
            spaceEvents.payload,
            spaceEvents.spaceId,
        ),
    ) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

#[update]
fn delete_space(id: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute("DELETE FROM Spaces WHERE Id = ?1;", (id.id,)) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

#[update]
fn delete_proposal(id: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute("DELETE FROM Proposals WHERE Id = ?1;", (id.id,)) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

#[update]
fn delete_proposal_option(id: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute("DELETE FROM ProposalOptions WHERE Id = ?1;", (id.id,)) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

#[update]
fn delete_proposal_option_vote(id: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute("DELETE FROM ProposalOptionVotes WHERE Id = ?1;", (id.id,)) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

#[update]
fn delete_proposal_block(id: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute("DELETE FROM ProposalBlocks WHERE Id = ?1;", (id.id,)) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

#[update]
fn delete_strategy(id: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute("DELETE FROM Strategies WHERE Id = ?1;", (id.id,)) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

#[update]
fn delete_space_event(id: GetByIdParams) -> Result {
    let conn = ic_sqlite::CONN.lock().unwrap();
    return match conn.execute("DELETE FROM SpaceEvents WHERE Id = ?1;", (id.id,)) {
        Ok(e) => Ok(format!("{:?}", e)),
        Err(err) => Err(Error::CanisterError {
            message: format!("{:?}", err),
        }),
    };
}

// #[update]
// fn delete(id: usize) -> Result {
//     let conn = ic_sqlite::CONN.lock().unwrap();
//     return match conn.execute(
//         "delete from person where id=?1",
//         (id,)
//     ) {
//         Ok(e) => Ok(format!("{:?}", e)),
//         Err(err) => Err(Error::CanisterError {message: format!("{:?}", err) })
//     }
// }

// #[update]
// fn update(params: UpdateParams) -> Result {
//     let conn = ic_sqlite::CONN.lock().unwrap();
//     return match conn.execute(
//         "update person set name=?1 where id=?2",
//         (params.name, params.id)
//     ) {
//         Ok(e) => Ok(format!("{:?}", e)),
//         Err(err) => Err(Error::CanisterError {message: format!("{:?}", err) })
//     }
// }

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct Admin {
    id: u32,
    address: String,
    // spaces: Vec<Space>,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct AdminSpace {
    id: u32,
    adminId: u32,
    spaceId: u32,
    // space: Option<Space>,
    // admin: Option<Admin>,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct Space {
    id: u32,
    name: String,
    iconLink: Option<String>,
    websiteLink: Option<String>,
    voteDelay: u32,
    voteDuration: u32,
    quorum: u32,
    minVoteRole: u32,
    minVotePower: u64,
    // admins :  Vec<Admin>,
    // proposals :  Vec<Proposal>,
    // strategies :  Vec<Strategy>,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct Proposal {
    id: u32,
    title: String,
    description: String,
    dateCreated: u32,
    mechanism: u32,
    // space: Option<Space>,
    spaceId: u32,
    // options: Vec<ProposalOption>,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct ProposalOption {
    id: u32,
    name: String,
    proposalId: u32,
    onWinContractAddress: String,
    onWinBytecode: String,
    onWinChainId: u32,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct ProposalOptionVote {
    id: u32,
    userAddress: String,
    voteType: u32,
    timestamp: u32,
    signature: String,
    votingPower: u64,
    optionId: u32,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct Strategy {
    id: u32,
    name: String,
    spaceId: u32,
    btcId: u32,
    evmId: u32,
    space: Option<Space>,
    btc: Option<BtcStrategy>,
    evm: Option<EvmStrategy>,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct BtcStrategy {
    id: u32,
    runeId: String,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct EvmStrategy {
    id: u32,
    chainId: u64,
    contractAddress: String,
    configString: String,
}

// #[derive(CandidType, Debug, Serialize, Deserialize, Default)]
// struct PersonQuery {
//     id: u32,
//     name: String,
//     age: u32,
// }

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct GetBtcStrategy {
    id: u32,
    name: String,
    description: String,
    spaceId: u32,
    runeId: String,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct GetEvmStrategy {
    id: u32,
    name: String,
    description: String,
    spaceId: u32,
    chainId: u64,
    contractAddress: String,
    configString: String,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct SpaceEvent {
    id: u32,
    eventtype: u32,
    webhookUrl: String,
    payload: String,
    spaceId: u32,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct QueryParams {
    limit: u32,
    offset: u32,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct GetByIdParams {
    id: u32,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct GetByAdressAndId {
    id: u32,
    address: String,
}

// #[derive(CandidType, Debug, Serialize, Deserialize, Default)]
// struct FilterParams {
//     name: String,
// }

// #[derive(CandidType, Debug, Serialize, Deserialize, Default)]
// struct UpdateParams {
//     id: u32,
//     name: String
// }

// ----------------- Inserts -----------------
#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct InsertBtcStrategy {
    name: String,
    description: String,
    spaceId: u32,
    runeId: String,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct InsertEvmStrategy {
    id: u32,
    name: String,
    description: String,
    spaceId: u32,
    chainId: u64,
    contractAddress: String,
    configString: String,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct InsertProposal {
    title: String,
    description: String,
    mechanism: u32,
    dateCreated: u32,
    spaceId: u32,
}
#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct InsertProposalOption {
    name: String,
    proposalId: u32,
    onWinChainId: u64,
    onWinContractAddress: String,
    onWinBytecode: String,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct InsertProposalOptionVote {
    userAddress: String,
    voteType: u32,
    timestamp: u32,
    signature: String,
    votingPower: u64,
    optionId: u32,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct InsertProposalBlock {
    voteType: u32,
    chainId: Option<u64>,
    blocknumber: u32,
    proposalID: u32,
}
//----------------- Selects -----------------

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct GetProposalVotingPower {
    id: u32,
    name: String,
    power: u32,
}

#[derive(CandidType, Deserialize)]
enum Error {
    InvalidCanister,
    CanisterError { message: String },
}

type Result<T = String, E = Error> = std::result::Result<T, E>;

impl From<(RejectionCode, String)> for Error {
    fn from((code, message): (RejectionCode, String)) -> Self {
        match code {
            RejectionCode::CanisterError => Self::CanisterError { message },
            _ => Self::InvalidCanister,
        }
    }
}
