export enum ProposalMechanism {
  SINGLE = "Single Choice",
  MULTIPLE = "Multiple Choice"
}

export type Proposal = {
  id: number
  title: string
  description: string
  mechanism: ProposalMechanism
  dateCreated: number
}

export const dummyProposals: Proposal[] = [
  {
    id: 0,
    title: "Proposal 0",
    description:
      "lotem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    mechanism: ProposalMechanism.SINGLE,
    dateCreated: 1707238349
  },
  {
    id: 1,
    title: "Proposal 1",
    description:
      "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    mechanism: ProposalMechanism.SINGLE,
    dateCreated: 1717238349
  },
  {
    id: 2,
    title: "Proposal 2",
    description: "Description 2",
    mechanism: ProposalMechanism.MULTIPLE,
    dateCreated: 1717234349
  }
]
