import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Link } from "react-router";
import { User, Building2 } from "lucide-react";

export function LoginSignup() {
  const [selectedRole, setSelectedRole] = useState<"client" | "resource" | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <h2>TalentHub</h2>
          </Link>
          <p className="text-muted-foreground">Welcome back! Please enter your details</p>
        </div>

        <Card className="p-8">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    Remember me
                  </label>
                  <a href="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <Button className="w-full" size="lg" asChild>
                  <Link to="/client/dashboard">Login</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup">
              <div className="space-y-6">
                {/* Role Selection */}
                {!selectedRole && (
                  <div>
                    <Label className="mb-4 block">I want to join as:</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Card
                        className="p-6 cursor-pointer hover:border-primary transition-colors"
                        onClick={() => setSelectedRole("client")}
                      >
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">Client</h3>
                            <p className="text-sm text-muted-foreground">
                              I want to hire talent
                            </p>
                          </div>
                        </div>
                      </Card>
                      <Card
                        className="p-6 cursor-pointer hover:border-primary transition-colors"
                        onClick={() => setSelectedRole("resource")}
                      >
                        <div className="flex flex-col items-center text-center gap-3">
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-8 w-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">Expert</h3>
                            <p className="text-sm text-muted-foreground">
                              I want to find work
                            </p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Signup Form */}
                {selectedRole && (
                  <>
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Signing up as:
                        </p>
                        <p className="font-semibold">
                          {selectedRole === "client" ? "Client" : "Expert"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRole(null)}
                      >
                        Change
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" />
                      </div>
                    </div>

                    {selectedRole === "client" && (
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input id="company" placeholder="Acme Inc." />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                      />
                    </div>

                    {selectedRole === "resource" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="primarySkill">Primary Skill</Label>
                          <select
                            id="primarySkill"
                            className="w-full h-10 rounded-md border border-input bg-background px-3"
                          >
                            <option value="">Select primary skill</option>
                            <option value="appian">Appian</option>
                            <option value="outsystems">OutSystems</option>
                            <option value="mendix">Mendix</option>
                            <option value="pega">Pega</option>
                            <option value="powerapps">Power Apps</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Years of Experience</Label>
                          <Input
                            id="experience"
                            type="number"
                            placeholder="5"
                          />
                        </div>
                      </>
                    )}

                    <label className="flex items-start gap-2 text-sm">
                      <input type="checkbox" className="mt-1 rounded" />
                      <span className="text-muted-foreground">
                        I agree to the Terms of Service and Privacy Policy
                      </span>
                    </label>

                    <Button className="w-full" size="lg" asChild>
                      <Link to="/client/dashboard">Create Account</Link>
                    </Button>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
