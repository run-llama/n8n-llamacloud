package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"
)

const (
	VERSION_FILE string = "sdk/version.ts"
	PACKAGE_NAME string = "@llamaindex/llama-cloud"
	PACKAGE_JSON string = "package.json"
	Patch        string = "patch"
	Minor        string = "minor"
	Major        string = "major"
)

type PackageJSON struct {
	Name             string                 `json:"name"`
	Version          string                 `json:"version"`
	Description      string                 `json:"description"`
	Keywords         []string               `json:"keywords"`
	License          string                 `json:"license"`
	Homepage         string                 `json:"homepage"`
	Author           map[string]string      `json:"author"`
	Contributors     []map[string]string    `json:"contributors"`
	Repository       map[string]string      `json:"repository"`
	Engines          map[string]string      `json:"engines"`
	Main             string                 `json:"main"`
	Scripts          map[string]string      `json:"scripts"`
	Files            []string               `json:"files"`
	N8N              map[string]interface{} `json:"n8n"`
	DevDependencies  map[string]string      `json:"devDependencies"`
	PeerDependencies map[string]string      `json:"peerDependencies"`
	Dependencies     map[string]string      `json:"dependencies"`
}

func findVersion() (string, error) {
	content, err := os.ReadFile(VERSION_FILE)
	if err != nil {
		log.Fatalf("An error occurred: %s", err.Error())
		os.Exit(1)
	}
	pattern := regexp.MustCompile(`export const VERSION = \'([0-9].[0-9]+.[0-9]+)\'`)
	contentStr := string(content)
	match := pattern.FindStringSubmatch(contentStr)

	if len(match) > 1 {
		return match[1], nil
	}
	return "", errors.New("could not find a version for the current package")
}

func checkVersion() {
	version, err := findVersion()
	if err != nil {
		log.Fatalf("An error occurred: %s", err.Error())
		os.Exit(1)
	}
	request, err := http.NewRequest("GET", fmt.Sprintf("https://registry.npmjs.org/%s/latest", PACKAGE_NAME), nil)
	if err != nil {
		log.Fatalf("An error occurred: %s", err.Error())
		os.Exit(1)
	}
	client := http.Client{Timeout: 60 * time.Second}
	response, err := client.Do(request)
	if err != nil {
		log.Fatalf("An error occurred: %s", err.Error())
		os.Exit(1)
	}
	if response.StatusCode > 299 || response.StatusCode < 200 {
		log.Fatalf("Error in response: %d", response.StatusCode)
		os.Exit(1)
	}
	var data map[string]any
	err = json.NewDecoder(response.Body).Decode(&data)
	publishedVersion, ok := data["version"]
	if !ok {
		log.Fatal("Could not find a published version, exiting...")
		os.Exit(1)
	}
	log.Printf("Found published version: %s", publishedVersion)
	if publishedVersion != version {
		log.Fatalf("Version mismatch: current is %s, published is %s; you should update!", version, publishedVersion)
		os.Exit(2)
	}
	log.Println("Versions are matching, nothing else to do!")
	os.Exit(0)
}

func bumpVersion(bumpType string) {
	content, err := os.ReadFile(PACKAGE_JSON)
	if err != nil {
		log.Fatalf("An error occurred while reading package.json: %s", err.Error())
		os.Exit(1)
	}
	var packageData PackageJSON
	err = json.Unmarshal(content, &packageData)
	if err != nil {
		log.Fatalf("An error occurred while loading package.json content: %s", err.Error())
		os.Exit(1)
	}
	version := packageData.Version
	log.Printf("Found package version: %s\n", version)
	splitVersion := strings.Split(version, ".")
	if len(splitVersion) != 3 {
		log.Fatalf("Version does not respect SemVer convention of major.minor.patch: %s", version)
		os.Exit(1)
	}
	versNum := make([]int, 0, 3)
	for _, v := range splitVersion {
		vint, err := strconv.Atoi(v)
		if err != nil {
			log.Fatalf("An error occurred while converting version components to numbers: %s", err.Error())
			os.Exit(1)
		}
		versNum = append(versNum, vint)
	}
	newVers := make([]string, 0, 3)
	switch bumpType {
	case Patch:
		newVers = append(newVers, strconv.Itoa(versNum[0]), strconv.Itoa(versNum[1]), strconv.Itoa(versNum[2]+1))
	case Minor:
		newVers = append(newVers, strconv.Itoa(versNum[0]), strconv.Itoa(versNum[1]+1), "0")
	case Major:
		newVers = append(newVers, strconv.Itoa(versNum[0]+1), "0", "0")
	default:
		log.Fatalf("Unrecognized bump type: %s", bumpType)
		os.Exit(1)
	}
	newVersion := strings.Join(newVers, ".")
	packageData.Version = newVersion
	jsonContent, err := json.MarshalIndent(packageData, "", "\t")
	err = os.WriteFile(PACKAGE_JSON, jsonContent, 0644)
	if err != nil {
		log.Fatalf("An error occurred while writing package.json: %s", err.Error())
		os.Exit(1)
	}
	log.Printf("Version was correctly bumped: %s -> %s\n", version, newVersion)
	os.Exit(0)
}

func printCurrentVersion() {
	content, err := os.ReadFile(PACKAGE_JSON)
	if err != nil {
		log.Fatalf("An error occurred while reading package.json: %s", err.Error())
		os.Exit(1)
	}
	var packageData PackageJSON
	err = json.Unmarshal(content, &packageData)
	if err != nil {
		log.Fatalf("An error occurred while loading package.json content: %s", err.Error())
		os.Exit(1)
	}
	fmt.Println(packageData.Version)
}

func main() {
	args := os.Args
	if len(args) < 2 {
		log.Fatalln("You should provide at least one argument to command line")
		os.Exit(1)
	}
	subCommand := args[1]
	switch subCommand {
	case "check":
		checkVersion()
	case "version-bump":
		if len(args) < 3 {
			log.Fatalln("You should provide a bump type (patch, minor, major) when using the version-bump subcommand")
			os.Exit(1)
		}
		bump := args[2]
		bumpVersion(strings.ToLower(bump))
	case "get-version":
		printCurrentVersion()
	default:
		log.Fatalf("Unrecognized command: %s\n", args[1])
		os.Exit(1)
	}
}
