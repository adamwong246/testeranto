package golingvu

import (
	"encoding/json"
	"fmt"
	"net"
	"os"
	"strconv"
	"time"
)

type PM_Golang struct {
	testResourceConfiguration ITTestResourceConfiguration
	client                    net.Conn
}

func NewPM_Golang(t ITTestResourceConfiguration, ipcFile string) (*PM_Golang, error) {
	// Connect to the IPC socket
	conn, err := net.Dial("unix", ipcFile)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to IPC file %s: %v", ipcFile, err)
	}

	return &PM_Golang{
		testResourceConfiguration: t,
		client:                    conn,
	}, nil
}

func (pm *PM_Golang) Start() error {
	return nil
}

func (pm *PM_Golang) Stop() error {
	if pm.client != nil {
		return pm.client.Close()
	}
	return nil
}

func (pm *PM_Golang) send(command string, args ...interface{}) (interface{}, error) {
	// Generate a unique key
	key := strconv.FormatInt(time.Now().UnixNano(), 10)
	
	// Create the message array
	message := []interface{}{command}
	message = append(message, args...)
	message = append(message, key)
	
	// Convert to JSON
	data, err := json.Marshal(message)
	if err != nil {
		return nil, err
	}
	
	// Send the length first (4-byte big-endian)
	length := uint32(len(data))
	lengthBytes := []byte{
		byte(length >> 24),
		byte(length >> 16),
		byte(length >> 8),
		byte(length),
	}
	
	_, err = pm.client.Write(lengthBytes)
	if err != nil {
		return nil, err
	}
	
	// Send the actual data
	_, err = pm.client.Write(data)
	if err != nil {
		return nil, err
	}
	
	// Wait for response
	// First read the length
	lengthBytes = make([]byte, 4)
	_, err = pm.client.Read(lengthBytes)
	if err != nil {
		return nil, err
	}
	
	length = uint32(lengthBytes[0])<<24 | uint32(lengthBytes[1])<<16 | 
		uint32(lengthBytes[2])<<8 | uint32(lengthBytes[3])
	
	// Read the response data
	responseData := make([]byte, length)
	_, err = pm.client.Read(responseData)
	if err != nil {
		return nil, err
	}
	
	// Parse the response
	var response map[string]interface{}
	err = json.Unmarshal(responseData, &response)
	if err != nil {
		return nil, err
	}
	
	// Check if the response key matches our request key
	if responseKey, ok := response["key"].(string); ok && responseKey == key {
		return response["payload"], nil
	}
	
	return nil, fmt.Errorf("key mismatch in response")
}

// Implement all the PM methods to match Node and Python implementations
func (pm *PM_Golang) Pages() ([]string, error) {
	result, err := pm.send("pages")
	if err != nil {
		return nil, err
	}
	return result.([]string), nil
}

func (pm *PM_Golang) WaitForSelector(page, selector string) (interface{}, error) {
	return pm.send("waitForSelector", page, selector)
}

func (pm *PM_Golang) ClosePage(page interface{}) (interface{}, error) {
	return pm.send("closePage", page)
}

func (pm *PM_Golang) Goto(page, url string) (interface{}, error) {
	return pm.send("goto", page, url)
}

func (pm *PM_Golang) NewPage() (string, error) {
	result, err := pm.send("newPage")
	if err != nil {
		return "", err
	}
	return result.(string), nil
}

func (pm *PM_Golang) Selector(selector, page string) (interface{}, error) {
	return pm.send("$", selector, page)
}

func (pm *PM_Golang) IsDisabled(selector string) (bool, error) {
	result, err := pm.send("isDisabled", selector)
	if err != nil {
		return false, err
	}
	return result.(bool), nil
}

func (pm *PM_Golang) GetAttribute(selector, attribute, page string) (interface{}, error) {
	return pm.send("getAttribute", selector, attribute, page)
}

func (pm *PM_Golang) GetInnerHtml(selector, page string) (interface{}, error) {
	return pm.send("getInnerHtml", selector, page)
}

func (pm *PM_Golang) FocusOn(selector string) (interface{}, error) {
	return pm.send("focusOn", selector)
}

func (pm *PM_Golang) TypeInto(selector string) (interface{}, error) {
	return pm.send("typeInto", selector)
}

func (pm *PM_Golang) Page() (string, error) {
	result, err := pm.send("page")
	if err != nil {
		return "", err
	}
	return result.(string), nil
}

func (pm *PM_Golang) Click(selector string) (interface{}, error) {
	return pm.send("click", selector)
}

func (pm *PM_Golang) Screencast(opts map[string]interface{}, page string) (interface{}, error) {
	return pm.send("screencast", opts, page, pm.testResourceConfiguration.Name)
}

func (pm *PM_Golang) ScreencastStop(page string) (interface{}, error) {
	return pm.send("screencastStop", page)
}

func (pm *PM_Golang) CustomScreenshot(opts map[string]interface{}, page string) (interface{}, error) {
	return pm.send("customScreenShot", opts, pm.testResourceConfiguration.Name, page)
}

func (pm *PM_Golang) ExistsSync(destFolder string) (bool, error) {
	path := pm.testResourceConfiguration.Fs + "/" + destFolder
	result, err := pm.send("existsSync", path)
	if err != nil {
		return false, err
	}
	return result.(bool), nil
}

func (pm *PM_Golang) MkdirSync() (interface{}, error) {
	path := pm.testResourceConfiguration.Fs + "/"
	return pm.send("mkdirSync", path)
}

func (pm *PM_Golang) Write(uid int, contents string) (bool, error) {
	result, err := pm.send("write", uid, contents)
	if err != nil {
		return false, err
	}
	return result.(bool), nil
}

func (pm *PM_Golang) WriteFileSync(filepath, contents string) (bool, error) {
	fullPath := pm.testResourceConfiguration.Fs + "/" + filepath
	result, err := pm.send("writeFileSync", fullPath, contents, pm.testResourceConfiguration.Name)
	if err != nil {
		return false, err
	}
	return result.(bool), nil
}

func (pm *PM_Golang) CreateWriteStream(filepath string) (string, error) {
	fullPath := pm.testResourceConfiguration.Fs + "/" + filepath
	result, err := pm.send("createWriteStream", fullPath, pm.testResourceConfiguration.Name)
	if err != nil {
		return "", err
	}
	return result.(string), nil
}

func (pm *PM_Golang) End(uid interface{}) (bool, error) {
	result, err := pm.send("end", uid)
	if err != nil {
		return false, err
	}
	return result.(bool), nil
}

func (pm *PM_Golang) CustomClose() (interface{}, error) {
	return pm.send("customclose", pm.testResourceConfiguration.Fs, pm.testResourceConfiguration.Name)
}

func (pm *PM_Golang) TestArtiFactoryfileWriter(tLog func(...interface{}), callback func(promise interface{})) interface{} {
	// This would need to be implemented to match the Node.js implementation
	// For now, return a placeholder
	return func(fPath string, value interface{}) {
		// Implementation would go here
	}
}
