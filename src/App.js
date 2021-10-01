import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Grid,
  Header,
  Icon,
  Image,
  Input,
  Menu,
  MenuItem,
} from "semantic-ui-react";
import "./App.css";
import { fromNow } from "./utils/date";

const defaultUrl =
  "https://cloud.mail.aristocrazy.com/date_form?sk=0036N00000A9yGUQAZ";

// const apiHost = "http://localhost:3001";
const apiHost = "https://previews-server.herokuapp.com";

async function listPreviews(url) {
  let query = `?url=${url}`;
  const response = await fetch(`${apiHost}/api/previews${query}`);
  const { previews } = await response.json();
  return previews;
}

function renderDescription(preview) {
  if (!preview) {
    return null;
  }

  return (
    <Grid>
      {renderDimensions("Expected:", preview.width, preview.height)}
      {renderDimensions("Real:", preview.size.width, preview.size.height)}
      {preview.isMobile && (
        <Grid.Column width="16">
          <div>
            <Icon name="mobile altername" />
            <span>is mobile</span>
          </div>
        </Grid.Column>
      )}
      {preview.isLandscape && (
        <Grid.Column width="16">
          <div>
            <Icon name="mobile alternate" rotated="clockwise" />
            <span>is landscape</span>
          </div>
        </Grid.Column>
      )}
      <Grid.Column width={16}>
        <a
          href={`${apiHost}${preview.path}?ts=${performance.now()}`}
          target="_blank"
          rel="noreferrer"
          primary
          fluid
        >
          <Icon name="external alternate" />
          <span>View full size</span>
        </a>
      </Grid.Column>
    </Grid>
  );
}

function renderDimensions(label, width, height) {
  return (
    <Grid.Row>
      <Grid.Column width="4">{label}</Grid.Column>
      <Grid.Column textAlign="right" width="11">
        {width} x {height} pixels
      </Grid.Column>
    </Grid.Row>
  );
}

function App() {
  const [url, setUrl] = useState(defaultUrl);
  const [preview, setPreview] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function runPreviewsUpdate() {
      console.log(">Requesting previews");
      const preview = await listPreviews(url);
      setPreview(preview);
    }
    runPreviewsUpdate();
  }, [url]);

  async function requestPreviewGeneration(url) {
    console.log("Requesting preview for url", url);
    setPreview([]);
    const response = await fetch(`${apiHost}/api/previews`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }, null, 2),
      method: "POST",
    });
    const { preview } = await response.json();
    setPreview(preview);
    setLoading(false);
  }

  console.log("preview", preview);
  return (
    <>
      <Menu attached top>
        <MenuItem>
          <Icon name="chrome" size="big" />
        </MenuItem>
        <MenuItem style={{ width: "400px" }}>
          <Input
            action={{
              icon: "download",
              onClick: () => {
                setLoading(true);
                requestPreviewGeneration(url);
              },
            }}
            placeholder="Type the URL to preview ..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            type="url"
          />
        </MenuItem>
      </Menu>

      <Container fluid textAlign="justified">
        {preview && (
          <Card.Group itemsPerRow="6">
            {preview.images?.map((preview) => (
              <Card>
                <div className="image preview">
                  <Image
                    src={`${apiHost}${preview.path}?ts=${performance.now()}`}
                    key={preview.path}
                    ui={false}
                  />
                </div>

                <Card.Content>
                  <Card.Header>{preview.deviceName}</Card.Header>
                  <Card.Meta>{fromNow(preview.updated)}</Card.Meta>
                  <Card.Description>
                    {renderDescription(preview)}
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Button
                    as="a"
                    href={`${apiHost}${preview.path}`}
                    target="_blank"
                    rel="noreferrer"
                    primary
                    fluid
                  >
                    <Icon name="image" />
                    Open in another tab
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </Card.Group>
        )}
      </Container>

      <Dimmer active={loading} onClickOutside={() => setLoading(false)} page>
        <Header as="h2" icon inverted>
          <Icon loading name="spinner" />
          Generating preview ...
          <Header.Subheader>This will take some time</Header.Subheader>
        </Header>
      </Dimmer>
    </>
  );
}

export default App;
