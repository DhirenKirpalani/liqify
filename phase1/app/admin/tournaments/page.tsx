"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Trash2, Edit, Plus, Trophy } from 'lucide-react';

// Mock data for existing tournaments
const mockTournaments = [
  {
    id: 1,
    name: "Weekly Championship",
    startDate: "2025-07-15",
    endDate: "2025-07-21",
    registrationOpen: true,
    entryFee: 25,
    maxParticipants: 64,
    prizePool: 1500,
    status: "upcoming"
  },
  {
    id: 2,
    name: "Pro Trader Invitational",
    startDate: "2025-08-01",
    endDate: "2025-08-03",
    registrationOpen: false,
    entryFee: 50,
    maxParticipants: 32,
    prizePool: 1600,
    status: "upcoming"
  },
  {
    id: 3,
    name: "Summer Trading Cup",
    startDate: "2025-06-10",
    endDate: "2025-06-17",
    registrationOpen: false,
    entryFee: 15,
    maxParticipants: 128,
    prizePool: 1920,
    status: "completed"
  }
];

export default function TournamentManagement() {
  const [activeTab, setActiveTab] = useState('existing');
  const [tournamentName, setTournamentName] = useState('');
  const [entryFee, setEntryFee] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  
  // Filter tournaments by status
  const upcomingTournaments = mockTournaments.filter(t => t.status === 'upcoming');
  const completedTournaments = mockTournaments.filter(t => t.status === 'completed');
  
  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API endpoint to create the tournament
    alert('Tournament created successfully!');
    
    // Reset form
    setTournamentName('');
    setEntryFee('');
    setStartDate('');
    setEndDate('');
    setMaxParticipants('');
    setIsPrivate(false);
    
    // Switch to existing tournaments tab
    setActiveTab('existing');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tournament Management</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-dark-card border border-dark-border">
          <TabsTrigger value="existing" className="data-[state=active]:bg-electric-purple/20 data-[state=active]:text-electric-purple">
            Existing Tournaments
          </TabsTrigger>
          <TabsTrigger value="create" className="data-[state=active]:bg-cyber-blue/20 data-[state=active]:text-cyber-blue">
            Create Tournament
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="existing" className="space-y-6">
          <div className="mb-4 flex justify-end">
            <Button 
              variant="outline" 
              className="bg-transparent border-cyber-blue text-cyber-blue hover:bg-cyber-blue/20"
              onClick={() => setActiveTab('create')}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Tournament
            </Button>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-electric-purple">Upcoming Tournaments</h3>
            {upcomingTournaments.map((tournament) => (
              <Card key={tournament.id} className="border border-dark-border bg-dark-card">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-neon-cyan font-orbitron">{tournament.name}</CardTitle>
                      <CardDescription>
                        {tournament.startDate} to {tournament.endDate}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="bg-transparent border-electric-purple text-electric-purple hover:bg-electric-purple/20 h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button size="sm" variant="outline" className="bg-transparent border-red-400 text-red-400 hover:bg-red-400/20 h-8 w-8 p-0">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Entry Fee</span>
                      <div className="font-medium">{tournament.entryFee} USDC</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Prize Pool</span>
                      <div className="font-medium">{tournament.prizePool} USDC</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Capacity</span>
                      <div className="font-medium">{tournament.maxParticipants} players</div>
                    </div>
                    <div>
                      <span className="text-gray-400">Registration</span>
                      <div className={`font-medium ${tournament.registrationOpen ? 'text-neon-cyan' : 'text-gray-400'}`}>
                        {tournament.registrationOpen ? 'Open' : 'Closed'}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-3">
                  <Button variant="outline" className="bg-transparent border-warning-orange text-warning-orange hover:bg-warning-orange/20">
                    <Trophy className="h-4 w-4 mr-2" />
                    Manage Brackets
                  </Button>
                  <Button
                    variant="outline"
                    className={`bg-transparent ${
                      tournament.registrationOpen 
                        ? 'border-red-400 text-red-400 hover:bg-red-400/20' 
                        : 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/20'
                    }`}
                  >
                    {tournament.registrationOpen ? 'Close Registration' : 'Open Registration'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {completedTournaments.length > 0 && (
            <div className="space-y-6 mt-8">
              <h3 className="text-xl font-semibold text-electric-purple">Completed Tournaments</h3>
              {completedTournaments.map((tournament) => (
                <Card key={tournament.id} className="border border-dark-border bg-dark-card opacity-70">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-gray-300 font-orbitron">{tournament.name}</CardTitle>
                        <CardDescription>
                          {tournament.startDate} to {tournament.endDate}
                        </CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="bg-transparent border-gray-500 text-gray-500 hover:bg-gray-500/20 h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Entry Fee</span>
                        <div className="font-medium">{tournament.entryFee} USDC</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Prize Pool</span>
                        <div className="font-medium">{tournament.prizePool} USDC</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Capacity</span>
                        <div className="font-medium">{tournament.maxParticipants} players</div>
                      </div>
                      <div>
                        <span className="text-gray-400">Status</span>
                        <div className="font-medium text-gray-400">Completed</div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-3">
                    <Button variant="outline" className="bg-transparent border-warning-orange text-warning-orange hover:bg-warning-orange/20">
                      <Trophy className="h-4 w-4 mr-2" />
                      View Results
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <Card className="border border-dark-border bg-dark-card">
            <CardHeader>
              <CardTitle className="text-xl text-cyber-blue font-orbitron">Create New Tournament</CardTitle>
              <CardDescription>Configure tournament settings and rules</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTournament} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tournament-name">Tournament Name</Label>
                    <Input 
                      id="tournament-name" 
                      value={tournamentName} 
                      onChange={(e) => setTournamentName(e.target.value)}
                      placeholder="e.g. Summer Championship" 
                      className="bg-dark-bg border-dark-border mt-1"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start-date">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="start-date" 
                          type="date" 
                          value={startDate} 
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-dark-bg border-dark-border pl-10 mt-1"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="end-date">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="end-date" 
                          type="date" 
                          value={endDate} 
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-dark-bg border-dark-border pl-10 mt-1"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="entry-fee">Entry Fee (USDC)</Label>
                      <Input 
                        id="entry-fee" 
                        type="number" 
                        value={entryFee} 
                        onChange={(e) => setEntryFee(e.target.value)}
                        placeholder="e.g. 25" 
                        className="bg-dark-bg border-dark-border mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="max-participants">Max Participants</Label>
                      <Select 
                        value={maxParticipants} 
                        onValueChange={setMaxParticipants}
                      >
                        <SelectTrigger className="bg-dark-bg border-dark-border mt-1">
                          <SelectValue placeholder="Select capacity" />
                        </SelectTrigger>
                        <SelectContent className="bg-dark-bg border-dark-border">
                          <SelectItem value="8">8 players</SelectItem>
                          <SelectItem value="16">16 players</SelectItem>
                          <SelectItem value="32">32 players</SelectItem>
                          <SelectItem value="64">64 players</SelectItem>
                          <SelectItem value="128">128 players</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="private-tournament" 
                      checked={isPrivate} 
                      onCheckedChange={setIsPrivate} 
                    />
                    <Label htmlFor="private-tournament">Private Tournament (Invitation Only)</Label>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                className="bg-transparent border-dark-border text-muted-foreground hover:bg-dark-bg"
                onClick={() => setActiveTab('existing')}
              >
                Cancel
              </Button>
              <Button 
                className="bg-cyber-blue hover:bg-cyber-blue/80"
                onClick={handleCreateTournament}
              >
                Create Tournament
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
