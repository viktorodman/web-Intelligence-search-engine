export type SearchScore = {
    link: string;
    score: number;
    contentScore: number;
    locationScore: number;
    pageRank: number;
}

export type SearchResult = {
    numOfResults: number;
    queryTime: number;
    searchScores: SearchScore[];
}