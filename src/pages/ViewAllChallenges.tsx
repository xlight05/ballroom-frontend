import { Button, Card, CardContent, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getChallangesByDifficulty } from "../api/admin";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Layout } from "../components/templates";
import CardActions from "@mui/material/CardActions";
import { Link } from "react-router-dom";

type Challenge = {
    challengeId: string;
    title: string;
    difficulty: string;
};

const ViewAllChallenges : React.FC = () => {

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setvalue(newValue);
        setquery("");
    };
    const [challenges, setchallenges] = useState<Challenge[]>([]);
    const [query, setquery] = useState<string>("");
    const [value, setvalue] = useState(0);
    const axiosIns = useAxiosPrivate();

    useEffect(() => {
        let difficulty : string;
        switch (value) {
            case 0:
                difficulty = "EASY"
                break;
            case 1:
                difficulty =  "MEDIUM"
                break;
            case 2:
                difficulty =  "HARD"
                break;
            default:
                difficulty =  "EASY"
                break;
        }
        getChallangesByDifficulty(axiosIns,
            difficulty,
            (res: any) => {
            const listOfChallenges: any[] = res.data
            setchallenges(listOfChallenges.map((challenge) : Challenge => ({challengeId: challenge.challengeId, title: challenge.title, difficulty: challenge.difficulty})))
        },
        () => {})
    }, [value]);

    return (
        <Layout>
            <Tabs value={value} onChange={handleChange} centered>
                <Tab label="EASY" />
                <Tab label="MEDIUM" />
                <Tab label="HARD" />
            </Tabs>

            <TextField sx={{marginY: '2rem'}} id="outlined-basic" label="Search by title.." value={query} variant="outlined" onChange={(e) => setquery(e.target.value)}/>
           
            {challenges && challenges
            .filter((challenge) => challenge.title.toLowerCase().includes(query.toLowerCase()))
            .map((challenge) => (

                <Card key={challenge.challengeId} sx={{marginY: '1rem', width: '100%'}} >

                    <CardContent>
                        <Typography variant="h5" component="div">
                        {challenge.title}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {challenge.difficulty}
                        </Typography>
                    </CardContent>

                    <CardActions>
                                <Link to={`/challenges/${challenge.challengeId}`}><Button size="small">View</Button></Link>
                    </CardActions>

                </Card>
            ))}
    </Layout>
    );
}
 
export default ViewAllChallenges;