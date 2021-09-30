import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Dimmer,
  Header,
  Icon,
  Image,
  Input,
  Menu,
  MenuItem,
  Segment,
} from "semantic-ui-react";
import "./App.css";

const defaultUrl =
  "https://cloud.mail.aristocrazy.com/date_form?sk=0036N00000A9yGUQAZ";

async function listPreviews(url) {
  let query = `?url=${url}`;
  const response = await fetch(`http://localhost:3001/api/previews${query}`);
  const { previews } = await response.json();
  return previews;
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
    const response = await fetch("http://localhost:3001/api/previews", {
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
          <>
            <Segment>
              <Header as="h5">Fecha de actualización: {preview.updated}</Header>
            </Segment>
            <Card.Group itemsPerRow="6">
              {preview.images?.map((preview) => (
                <Card>
                  <Image
                    src={`http://localhost:3001${preview.path}`}
                    key={preview.path}
                    size="small"
                    ui={false}
                    className="preview"
                  />
                  <Card.Content>
                    <Card.Header>{preview.deviceName}</Card.Header>
                    <Card.Meta>
                      <span className="date">
                        {preview.width} x {preview.height} pixels
                      </span>
                    </Card.Meta>
                    <Card.Description>
                      Matthew is a musician living in Nashville.
                    </Card.Description>
                  </Card.Content>
                  <Card.Content extra>
                    <Button
                      as="a"
                      href={`http://localhost:3001${preview.path}`}
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
          </>
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
