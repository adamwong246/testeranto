package golingvu

// Ibdd_in_any represents the input types for BDD
type Ibdd_in_any interface {
	Iinput() interface{}
	Isubject() interface{}
	Istore() interface{}
	Iselection() interface{}
	Then() interface{}
	Given() interface{}
}

// Ibdd_out_any represents the output types for BDD
type Ibdd_out_any interface{}

// ITestSpecification defines the test specification function
type ITestSpecification func(suites, givens, whens, thens interface{}) interface{}

// ITestImplementation defines the test implementation structure
type ITestImplementation struct {
	Suites map[string]interface{}
	Givens map[string]interface{}
	Whens  map[string]interface{}
	Thens  map[string]interface{}
}

// ITestAdapter defines the adapter interface
type ITestAdapter interface {
	BeforeAll(input interface{}, tr ITTestResourceConfiguration, pm interface{}) interface{}
	AfterAll(store interface{}, pm interface{}) interface{}
	BeforeEach(subject, initializer interface{}, testResource ITTestResourceConfiguration, initialValues interface{}, pm interface{}) interface{}
	AfterEach(store interface{}, key string, pm interface{}) interface{}
	AndWhen(store, whenCB interface{}, testResource interface{}, pm interface{}) interface{}
	ButThen(store, thenCB interface{}, testResource interface{}, pm interface{}) interface{}
	AssertThis(t interface{}) bool
}

// ITTestResourceConfiguration represents test resource configuration
type ITTestResourceConfiguration struct {
	Name              string
	Fs                string
	BrowserWSEndpoint string
	Timeout           int
	Retries           int
	Environment       map[string]string
}

// ITTestResourceRequirement represents test resource requirements
type ITTestResourceRequirement struct {
	Name string
	Fs   string
}

// ITTestResourceRequest represents a test resource request
type ITTestResourceRequest struct {
}

// DefaultTestResourceRequest provides a default request
var DefaultTestResourceRequest = ITTestResourceRequest{}

// DefaultTestResourceRequirement provides a default requirement
var DefaultTestResourceRequirement = ITTestResourceRequirement{
	Name: "default",
	Fs:   "./",
}

