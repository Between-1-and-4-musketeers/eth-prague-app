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
           ContactAddress TEXT NOT NULL,
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
           BtcId INTEGER NULL,
           EvmId INTEGER NULL,
           CONSTRAINT FK_Strategies_BtcStrategies_BtcId FOREIGN KEY (BtcId) REFERENCES BtcStrategies (Id) ON DELETE CASCADE,
           CONSTRAINT FK_Strategies_EvmStrategies_EvmId FOREIGN KEY (EvmId) REFERENCES EvmStrategies (Id) ON DELETE CASCADE,
           CONSTRAINT FK_Strategies_Spaces_SpaceId FOREIGN KEY (SpaceId) REFERENCES Spaces (Id) ON DELETE CASCADE
       );
       
       CREATE TABLE ProposalOptions (
           Id INTEGER NOT NULL CONSTRAINT PK_ProposalOptions PRIMARY KEY AUTOINCREMENT,
           Name TEXT NOT NULL,
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
        ChainId INTEGER NOT NULL,
        BlockNumber INTEGER NOT NULL,
        ProposalID INTEGER NOT NULL,
        CONSTRAINT FK_ProposalBlocks_Proposals_BtcId FOREIGN KEY (ProposalID) REFERENCES Proposals (Id) ON DELETE CASCADE
    );
       
       CREATE INDEX IX_AdminSpaces_SpaceID ON AdminSpaces (SpaceID);
       
       CREATE INDEX IX_ProposalOptions_ProposalId ON ProposalOptions (ProposalId);
       
       CREATE INDEX IX_ProposalOptionVotes_OptionId ON ProposalOptionVotes (OptionId);
       
       CREATE INDEX IX_Proposals_SpaceId ON Proposals (SpaceId);
       
       CREATE UNIQUE INDEX IX_Strategies_BtcId ON Strategies (BtcId);
       
       CREATE UNIQUE INDEX IX_Strategies_EvmId ON Strategies (EvmId);
       
       CREATE INDEX IX_Strategies_SpaceId ON Strategies (SpaceId);

       CREATE INDEX IX_ProposalBlocks_ProposalId ON ProposalBlocks (ProposalID);
       
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
        "insert into Strategies(Name,SpaceId,BtcId,EvmId)
        values (?1,?2 ,last_insert_rowid(),null);",
        (insertBtc.name, insertBtc.spaceId),
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
    let res1 = conn.execute("BEGIN TRANSACTION;", []);
    let res2 = conn.execute(
        "insert into EvmStrategies(ChainId,ContactAddress,ConfigString) values (?1,?2,?3);",
        (
            insertEvm.chainId,
            insertEvm.contactAddress,
            insertEvm.configString,
        ),
    );
    let res3 = conn.execute(
        " insert into Strategies(Name,SpaceId,EvmId)
        values (?1,?2,last_insert_rowid());",
        (insertEvm.name, insertEvm.spaceId),
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
fn insert_proposal_with_option(insertProposal: InsertProposolaWithOption) -> Result {
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

    let parts = insertProposal.commaSeparatedOptions.split(",");
    for part in parts {
        let res3 = conn.execute(
            "insert into ProposalOptions (Name, ProposalId)
            VALUES (?1, (SELECT seq FROM SQLITE_SEQUENCE WHERE name='Proposals'));",
            [part],
        );
        match res3 {
            Ok(e) => continue,
            Err(err) => {
                let _ = conn.execute("ROLLBACK;", []);
                return Err(Error::CanisterError {
                    message: format!("{:?}", err),
                });
            }
        }
    }

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
    id: usize,
    address: String,
    // spaces: Vec<Space>,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct AdminSpace {
    id: usize,
    adminId: usize,
    spaceId: usize,
    // space: Option<Space>,
    // admin: Option<Admin>,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct Space {
    id: usize,
    name: String,
    iconLink: Option<String>,
    websiteLink: Option<String>,
    voteDelay: usize,
    voteDuration: usize,
    quorum: usize,
    minVoteRole: usize,
    minVotePower: usize,
    // admins :  Vec<Admin>,
    // proposals :  Vec<Proposal>,
    // strategies :  Vec<Strategy>,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct Proposal {
    id: usize,
    title: String,
    description: String,
    dateCreated: usize,
    mechanism: String,
    // space: Option<Space>,
    spaceId: usize,
    // options: Vec<ProposalOption>,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct ProposalOption {
    id: usize,
    name: String,
    proposalId: usize,
    // votes: Vec<ProposalOptionVote>,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct ProposalOptionVote {
    id: usize,
    userAddress: String,
    voteType: String,
    timestamp: usize,
    signature: String,
    votingPower: usize,
    optionId: usize,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct Strategy {
    id: usize,
    name: String,
    spaceId: usize,
    btcId: usize,
    evmId: usize,
    space: Option<Space>,
    btc: Option<BtcStrategy>,
    evm: Option<EvmStrategy>,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct BtcStrategy {
    id: usize,
    runeId: String,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct EvmStrategy {
    id: usize,
    chainId: usize,
    contactAddress: String,
    configString: String,
}

// #[derive(CandidType, Debug, Serialize, Deserialize, Default)]
// struct PersonQuery {
//     id: usize,
//     name: String,
//     age: usize,
// }

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct QueryParams {
    limit: usize,
    offset: usize,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct GetByIdParams {
    id: usize,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct GetByAdressAndId {
    id: usize,
    address: String,
}

// #[derive(CandidType, Debug, Serialize, Deserialize, Default)]
// struct FilterParams {
//     name: String,
// }

// #[derive(CandidType, Debug, Serialize, Deserialize, Default)]
// struct UpdateParams {
//     id: usize,
//     name: String
// }

// ----------------- Inserts -----------------
#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct InsertBtcStrategy {
    name: String,
    spaceId: usize,
    runeId: String,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct InsertEvmStrategy {
    name: String,
    spaceId: usize,
    chainId: usize,
    contactAddress: String,
    configString: String,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct InsertProposolaWithOption {
    title: String,
    description: String,
    mechanism: String,
    dateCreated: usize,
    spaceId: usize,
    commaSeparatedOptions: String,
}

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct InsertProposalOptionVote {
    userAddress: String,
    voteType: String,
    timestamp: usize,
    signature: String,
    votingPower: usize,
    optionId: usize,
}

//----------------- Selects -----------------

#[derive(CandidType, Debug, Serialize, Deserialize, Default)]
struct GetProposalVotingPower {
    id: usize,
    name: String,
    power: usize,
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
